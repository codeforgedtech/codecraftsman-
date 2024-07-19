import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

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

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      let { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false }); // Sorterar nyast först
      if (error) console.log('Error fetching posts:', error);
      else {
        setPosts(posts);
        setFilteredPosts(posts); // Initialt visa alla inlägg
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPosts(posts.filter(post => post.categories.includes(selectedCategory)));
    } else {
      setFilteredPosts(posts); // Visa alla inlägg om ingen kategori är vald
    }
  }, [selectedCategory, posts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container home">
      <div className="category-filter">
        <h4>Filter by Category:</h4>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredPosts.length === 0 && <p>No posts found for this category.</p>}

      {filteredPosts.map(post => (
        <Link to={`/post/${post.id}`} className="post-link" key={post.id}>
          {post.images && post.images.length > 0 && (
            <img src={post.images[0]} alt="Post thumbnail" />
          )}
          <div className="post-info">
            <h2>{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.content.substring(0, 600) }} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;
