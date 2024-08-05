import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import Select from 'react-select'; // Import React Select
import Resizer from 'react-image-file-resizer';
import '../styles/PostsManager.css';
import categories from '../constants/categories'; // Import categories

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedCategories, setEditedCategories] = useState([]);
  const [newImage, setNewImage] = useState(null); // För ny bild
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // För förhandsvisning av ny bild
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
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

    fetchPosts();
  }, []);

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedCategories(post.categories ? post.categories.map(cat => ({ value: cat, label: cat })) : []);
    setImagePreviewUrl(post.images && post.images.length > 0 ? `${post.images[0]}` : '');
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
        (uri) => {
          resolve(uri);
        },
        'blob',
        (error) => {
          reject(error);
        }
      );
    });

  const handleSaveEdit = async () => {
    try {
      if (!editedTitle || !editedContent) {
        setError('Title and content are required');
        return;
      }

      let imageUrl = ''; // URL till den nya bilden

      if (newImage) {
        // Om det finns en gammal bild, ta bort den från Supabase Storage
        if (editingPost.images && editingPost.images.length > 0) {
          const oldImagePath = editingPost.images[0]; // Anta att det bara finns en bild
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([oldImagePath]);

          if (deleteError) {
            throw deleteError;
          }
        }

        // Generera ett unikt filnamn för den nya bilden
        const uniqueFileName = `${Date.now()}-${newImage.name}`;

        // Ladda upp den nya bilden till Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`/public/images/${uniqueFileName}`, newImage);

        if (uploadError) {
          throw uploadError;
        }

        // Hämta URL till den uppladdade bilden
        imageUrl = uploadData.path;
      } else if (editingPost.images && editingPost.images.length > 0) {
        imageUrl = editingPost.images[0]; // Behåll den gamla bilden om ingen ny bild laddas upp
      }

      const updatedCategories = editedCategories.map(category => category.value);

      const { error } = await supabase
        .from('posts')
        .update({
          title: editedTitle,
          content: editedContent,
          categories: updatedCategories,
          images: imageUrl ? [imageUrl] : [] // Spara bild-URL som en array
        })
        .eq('id', editingPost.id);

      if (error) {
        throw error;
      }

      // Uppdatera posts state
      const updatedPosts = posts.map(post =>
        post.id === editingPost.id
          ? { ...post, title: editedTitle, content: editedContent, categories: updatedCategories, images: imageUrl ? [imageUrl] : [] }
          : post
      );
      setPosts(updatedPosts);
      setEditingPost(null);
      setNewImage(null); // Rensa vald bild
      setImagePreviewUrl(''); // Rensa förhandsvisning
      setError(null);
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
        // Ta bort alla bilder från Supabase storage
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
    } catch (error) {
      console.error('Error deleting post:', error.message);
      setError(`Error deleting post: ${error.message}`);
    }
  };

  return (
    <div className="posts-manager">
      {error && <div className="error">{error}</div>}
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
                {imagePreviewUrl && (
                  <img src={imagePreviewUrl} alt="Preview" className="image-preview" />
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                />
                <button onClick={handleSaveEdit}>Save</button>
              </div>
            ) : (
              <div>
                <h3>{post.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                {post.images && post.images.length > 0 && (
                  <img src={post.images[0]} alt="Post" />
                )}
                <button onClick={() => handleEditClick(post)}>Edit</button>
                <button onClick={() => handleDeleteClick(post.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No posts found</div>
      )}
    </div>
  );
};

export default PostsManager;

