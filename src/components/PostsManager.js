import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importera Quill CSS
import Select from 'react-select'; // Import React Select
import '../styles/PostsManager.css';

const categories = [
  { value: 'Programming', label: 'Programming' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'App Development', label: 'App Development' },
  { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'Hardware', label: 'Hardware' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Database Management', label: 'Database Management' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'UX/UI Design', label: 'UX/UI Design' },
  { value: 'Game Development', label: 'Game Development' },
  { value: 'Embedded Systems', label: 'Embedded Systems' },
  { value: 'Virtual Reality (VR) / Augmented Reality (AR)', label: 'Virtual Reality (VR) / Augmented Reality (AR)' },
  { value: 'Ethical Hacking', label: 'Ethical Hacking' },
  { value: 'Automation', label: 'Automation' },
  { value: 'Blockchain Technology', label: 'Blockchain Technology' },
  { value: 'Software Testing', label: 'Software Testing' },
  { value: 'Quantum Computing', label: 'Quantum Computing' }
];

const PostsManager = () => {
const [posts, setPosts]= useState([]);
const [editingPost, setEditingPost] = useState(null);
const [editedTitle, setEditedTitle] = useState('');
const [editedContent, setEditedContent] = useState('');
const [editedCategories, setEditedCategories] = useState([]);
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
  setEditedCategories(post.categories ? post.categories.map(cat => ({ value: cat, label: cat })) : []);
};

const handleSaveEdit = async () => {
  try {
    if (!editedTitle || !editedContent) {
      setError('Title and content are required');
      return;
    }

    const updatedCategories = editedCategories.map(category => category.value);

    const { data, error } = await supabase
      .from('posts')
      .update({ title: editedTitle, content: editedContent, categories: updatedCategories })
      .eq('id', editingPost.id);

    if (error) {
      throw error;
    }

    const updatedPosts = posts.map(post =>
      post.id === editingPost.id
        ? { ...post, title: editedTitle, content: editedContent, categories: updatedCategories }
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
              <Select
                isMulti
                value={editedCategories}
                onChange={setEditedCategories}
                options={categories}
                placeholder="Select categories"
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




