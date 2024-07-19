import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Admin = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePostSubmit = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        console.log('Title or content is empty');
        return;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: title,
            content: content,
          },
        ])
        .single();

      if (error) {
        throw error;
      }

      console.log('Post created:', data);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  return (
    <div>
      <h1>Create a new post</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handlePostSubmit}>Submit</button>
    </div>
  );
};

export default Admin;
