import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../supabaseClient';
import '../styles/CreatePost.css';
import Resizer from 'react-image-file-resizer';
import Select from 'react-select';

// Hjälpfunktion för att generera slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Ersätt icke-alfanumeriska tecken med -
    .replace(/^-+|-+$/g, ''); // Ta bort ledande och avslutande -
};

const categories = [
  { value: 'Programming', label: 'Programming' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'App Development', label: 'App Development' },
  { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Networking', label: 'Networking' }
];

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState(null);

  const handleCreatePost = async () => {
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    if (images.length > 4) {
      setError('You can upload a maximum of 4 images');
      return;
    }

    try {
      const imageUrls = [];

      // Generera slug
      const slug = generateSlug(title);

      // Loop through uploaded images
      for (const image of images) {
        const uniqueFileName = `${Date.now()}-${image.file.name}`;
        const resizedImage = await resizeImage(image.file);

        // Upload resized image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(uniqueFileName, resizedImage);

        if (uploadError) {
          throw uploadError;
        }

        console.log(`Image uploaded: ${uploadData.Key}`);

        // Get public URL for the uploaded image
        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('images')
          .getPublicUrl(uniqueFileName);

        if (publicUrlError) {
          throw publicUrlError;
        }

        const publicURL = publicUrlData.publicUrl;
        console.log(`Image URL for ${uniqueFileName}:`, publicURL);
        imageUrls.push(publicURL);
      }

      // Insert post into Supabase database with image URLs, categories, and slug
      const { data: postData, error: insertError } = await supabase.from('posts').insert([
        { 
          title, 
          slug, 
          content, 
          images: imageUrls, 
          categories: selectedCategories.map(cat => cat.value) 
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      console.log('Post created:', postData);
      setTitle('');
      setContent('');
      setImages([]);
      setSelectedCategories([]);
      setError(null); // Clear error state after successful post creation
    } catch (error) {
      console.error('Error creating post:', error.message);
      setError(`Error creating post: ${error.message}`);
    }
  };

  const handleImageChange = async (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resizedImage = await resizeImage(file);

      setImages((prevImages) => [
        ...prevImages,
        {
          file: file,
          previewUrl: URL.createObjectURL(resizedImage),
        },
      ]);
    }
  };

  const resizeImage = (file) =>
    new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        800,
        600,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'blob',
        (error) => {
          reject(error);
        }
      );
    });

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  return (
    <div className="container create-post">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ReactQuill className="quill" value={content} onChange={setContent} />
      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      {images.length > 0 && (
        <div>
          <h4>Selected Images:</h4>
          {images.map((image, index) => (
            <img key={index} src={image.previewUrl} alt={`Selected ${index}`} />
          ))}
        </div>
      )}
      <div className="category-selection">
        <h4>Select Categories:</h4>
        <Select
          isMulti
          options={categories}
          value={selectedCategories}
          onChange={handleCategoryChange}
          placeholder="Select categories..."
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
};

export default CreatePost;










