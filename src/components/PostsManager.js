import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import Resizer from 'react-image-file-resizer';
import categories from '../constants/categories';
import Notification from './Notification';
import '../styles/PostsManager.css';

// Helper function to fetch tags from Supabase
const fetchTags = async () => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*');
    if (error) throw error;
    return data.map(tag => ({ value: tag.name, label: tag.name }));
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    return [];
  }
};

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCategories, setEditedCategories] = useState([]);
  const [editedTags, setEditedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setError(`Error fetching posts: ${error.message}`);
      }
    };

    const loadTags = async () => {
      const tags = await fetchTags();
      setAvailableTags(tags);
    };

    loadPosts();
    loadTags();
  }, []);

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedCategories(post.categories ? post.categories.map(cat => ({ value: cat, label: cat })) : []);
    setEditedTags(post.tags ? post.tags.map(tag => ({ value: tag, label: tag })) : []);
    setImagePreviewUrl(post.images && post.images.length > 0 ? post.images[0] : '');
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const resizedImage = await resizeImage(file);
    setNewImage(file);
    setImagePreviewUrl(URL.createObjectURL(resizedImage));
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

  const handleSaveEdit = async () => {
    try {
      if (!editedTitle || !editedContent) {
        setError('Title and content are required');
        return;
      }

      let imageUrl = '';

      if (newImage) {
        if (editingPost.images && editingPost.images.length > 0) {
          const oldImagePath = editingPost.images[0];
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([oldImagePath]);

          if (deleteError) {
            throw deleteError;
          }
        }

        const uniqueFileName = `${Date.now()}-${newImage.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`/public/images/${uniqueFileName}`, newImage);

        if (uploadError) {
          throw uploadError;
        }

        imageUrl = uploadData.path;
      } else if (editingPost.images && editingPost.images.length > 0) {
        imageUrl = editingPost.images[0];
      }

      const updatedCategories = editedCategories.map(category => category.value);
      const updatedTags = editedTags.map(tag => tag.value);

      const { error } = await supabase
        .from('posts')
        .update({
          title: editedTitle,
          content: editedContent,
          categories: updatedCategories,
          tags: updatedTags,
          images: imageUrl ? [imageUrl] : []
        })
        .eq('id', editingPost.id);

      if (error) {
        throw error;
      }

      const updatedPosts = posts.map(post =>
        post.id === editingPost.id
          ? { ...post, title: editedTitle, content: editedContent, categories: updatedCategories, tags: updatedTags, images: imageUrl ? [imageUrl] : [] }
          : post
      );
      setPosts(updatedPosts);
      setEditingPost(null);
      setNewImage(null);
      setImagePreviewUrl('');
      setError(null);
      setSuccessMessage('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error.message);
      setError(`Error updating post: ${error.message}`);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const { data: post } = await supabase
        .from('posts')
        .select('images')
        .eq('id', id)
        .single();

      if (post.images) {
        const deletePromises = post.images.map(image => supabase.storage
          .from('images')
          .remove([image])
        );

        const deleteResults = await Promise.all(deletePromises);

        deleteResults.forEach(({ error }) => {
          if (error) {
            throw error;
          }
        });
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPosts(posts.filter(post => post.id !== id));
      setSuccessMessage('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error.message);
      setError(`Error deleting post: ${error.message}`);
    }
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

      const tags = await fetchTags();
      setAvailableTags(tags);
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error.message);
      setError(`Error adding tag: ${error.message}`);
    }
  };

  return (
    <div className="posts-manager">
      <Notification message={error} type="error" />
      <Notification message={successMessage} type="success" />
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            {editingPost?.id === post.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <ReactQuill
                  value={editedContent}
                  onChange={setEditedContent}
                  theme="snow"
                />
                <Select
                  isMulti
                  value={editedCategories}
                  onChange={setEditedCategories}
                  options={categories}
                  placeholder="Select categories"
                />
                <Select
                  isMulti
                  value={editedTags}
                  onChange={setEditedTags}
                  options={availableTags}
                  placeholder="Select tags"
                />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag"
                />
                <button onClick={handleAddTag}>Add Tag</button>
                {imagePreviewUrl && (
                  <img src={imagePreviewUrl} alt="Preview" className="image-preview" />
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                />
                <button className="save" onClick={handleSaveEdit}>Save</button>
                <button className="cancel" onClick={() => setEditingPost(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>{post.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="categories">
                  {post.categories && post.categories.map((category, index) => (
                    <span key={index} className="category">{category}</span>
                  ))}
                </div>
                <div className="tags-manager">
                  {post.tags && post.tags.map((tag, index) => (
                    <span key={index} className="tag-manager">{tag}</span>
                  ))}
                </div>
                <div className="image-preview">
                  {post.images && post.images.length > 0 && (
                    <img src={`${post.images[0]}`} alt="Post" />
                  )}
                </div>
                <button className="edit" onClick={() => handleEditClick(post)}>Edit</button>
                <button className="delete" onClick={() => handleDeleteClick(post.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default PostsManager;
