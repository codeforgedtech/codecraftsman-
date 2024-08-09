import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../supabaseClient';
import '../styles/CreatePost.css';
import Resizer from 'react-image-file-resizer';
import Select from 'react-select';
import Modal from 'react-modal';
import categories from '../constants/categories'; // Import categories

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with -
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing -
};

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('*');
        if (error) throw error;
        setAvailableTags(data.map(tag => ({ value: tag.name, label: tag.name })));
      } catch (error) {
        console.error('Error loading tags:', error.message);
      }
    };

    loadTags();
  }, []);

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
      const slug = generateSlug(title);

      for (const image of images) {
        const uniqueFileName = `${Date.now()}-${image.file.name}`;
        const resizedImage = await resizeImage(image.file);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(uniqueFileName, resizedImage);

        if (uploadError) throw uploadError;

        const { data: publicUrlData, error: publicUrlError } = await supabase.storage
          .from('images')
          .getPublicUrl(uniqueFileName);

        if (publicUrlError) throw publicUrlError;

        imageUrls.push(publicUrlData.publicUrl);
      }

      const { data: postData, error: insertError } = await supabase.from('posts').insert([
        { 
          title, 
          slug, 
          content, 
          images: imageUrls, 
          categories: selectedCategories.map(cat => cat.value), 
          tags: selectedTags.map(tag => tag.value) 
        },
      ]);

      if (insertError) throw insertError;

      setTitle('');
      setContent('');
      setImages([]);
      setSelectedCategories([]);
      setSelectedTags([]);
      setNewTag('');
      setError(null);
      setIsModalOpen(true);
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

      setImages(prevImages => [
        ...prevImages,
        { file: file, previewUrl: URL.createObjectURL(resizedImage) }
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
        (uri) => resolve(uri),
        'blob',
        (error) => reject(error)
      );
    });

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleAddTag = async () => {
    try {
      if (newTag.trim() === '') return;

      const existingTag = availableTags.find(tag => tag.value === newTag);
      if (existingTag) {
        alert('Tag already exists');
        return;
      }

      const { error } = await supabase
        .from('tags')
        .insert([{ name: newTag }]);

      if (error) throw error;

      const { data, error: fetchError } = await supabase
        .from('tags')
        .select('*');

      if (fetchError) throw fetchError;

      setAvailableTags(data.map(tag => ({ value: tag.name, label: tag.name })));
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error.message);
      setError(`Error adding tag: ${error.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <div className="tag-selection">
        <h4>Select Tags:</h4>
        <Select
          isMulti
          options={availableTags}
          value={selectedTags}
          onChange={handleTagChange}
          placeholder="Select tags..."
        />
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
        />
        <button onClick={handleAddTag}>Add Tag</button>
      </div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleCreatePost}>Create Post</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Post Created"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Post Created Successfully!</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default CreatePost;













