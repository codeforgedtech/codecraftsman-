import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importera Quill CSS
import '../styles/PostsManager.css';

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*');

        if (error) {
          throw error;
        }

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
  };

  const handleSaveEdit = async () => {
    try {
      if (!editedTitle || !editedContent) {
        setError('Title and content are required');
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .update({ title: editedTitle, content: editedContent })
        .eq('id', editingPost.id);

      if (error) {
        throw error;
      }

      const updatedPosts = posts.map(post =>
        post.id === editingPost.id
          ? { ...post, title: editedTitle, content: editedContent }
          : post
      );
      setPosts(updatedPosts);
      setEditingPost(null);
      setError(null);
    } catch (error) {
      console.error('Error updating post:', error.message);
      setError(`Error updating post: ${error.message}`);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
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
                <button className="save" onClick={handleSaveEdit}>Save</button>
                <button className="cancel" onClick={() => setEditingPost(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>{post.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
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


