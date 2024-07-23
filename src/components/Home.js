import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import LatestPostsSlider from './LatestPostsSlider';
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // Antal inlägg per sida

  useEffect(() => {
    const fetchPosts = async () => {
      let { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
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
      setCurrentPage(1); // Reset page to 1 when category changes
    } else {
      setFilteredPosts(posts); // Visa alla inlägg om ingen kategori är vald
    }
  }, [selectedCategory, posts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container home">
      <LatestPostsSlider posts={posts} />
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

      {currentPosts.length === 0 && <p>No posts found for this category.</p>}

      {currentPosts.map(post => (
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

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={filteredPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Home;

