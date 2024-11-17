import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../supabaseClient';
import '../styles/CreatePost.css';
import Resizer from 'react-image-file-resizer';

const categories = [
  'Programming',
  'Web Development',
  'App Development',
  'AI & Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Hardware',
  'Networking'
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

    if (images.length > 10) {
      setError('You can upload a maximum of 10 images');
      return;
    }

    try {
      const imageUrls = [];

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

      // Insert post into Supabase database with image URLs and selected categories
      const { data: postData, error: insertError } = await supabase.from('posts').insert([
        { title, content, images: imageUrls, categories: selectedCategories },
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

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCategories((prevCategories) => {
      if (checked) {
        return [...prevCategories, value];
      } else {
        return prevCategories.filter(category => category !== value);
      }
    });
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
            <div key={index} className="image-preview">
              <img src={image.previewUrl} alt={`Selected ${index}`} />
              <button onClick={() => handleRemoveImage(index)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <div className="category-selection">
        <h4>Select Categories:</h4>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={handleCategoryChange}
            />
            {category}
          </label>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
};

export default CreatePost;










