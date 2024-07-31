import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import LatestPostsSlider from './LatestPostsSlider';
import { Helmet } from 'react-helmet';
import Loader from './Loader';
import '../styles/Home.css';

const categories = [
  'Programming', 'Web Development', 'App Development', 'AI & Machine Learning', 
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'Hardware', 'Networking', 
  'Database Management', 'Software Engineering', 'DevOps', 'UX/UI Design', 
  'Game Development', 'Embedded Systems', 'Virtual Reality (VR) / Augmented Reality (AR)', 
  'Ethical Hacking', 'Automation', 'Blockchain Technology', 'Software Testing', 
  'Quantum Computing'
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Sökterm state
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) console.log('Error fetching posts:', error);
      else {
        setPosts(posts);
        setFilteredPosts(posts);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (selectedCategory) {
      filtered = filtered.filter(post => post.categories.includes(selectedCategory));
    }
    if (searchTerm) {
      filtered = filtered.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset page to 1 when filter changes
  }, [selectedCategory, searchTerm, posts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container home">
      <Helmet>
        <title>Latest Tech Blog Posts</title>
        <meta name="description" content="Read the latest blog posts on technology, programming, web development, and more. Stay updated with our latest articles." />
        <meta name="keywords" content="technology, programming, web development, tech blog, latest articles" />
      </Helmet>
      <LatestPostsSlider posts={posts} />
      <div className="filter-section">
        <div className="category-filter">
          <h4>Filter by Category:</h4>
          <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="search-filter">
          <h4>Search:</h4>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search posts"
          />
        </div>
      </div>

      {currentPosts.length === 0 && <p>No posts found for this category.</p>}

      {currentPosts.map(post => (
        <Link to={`/post/${post.slug}`} className="post-link" key={post.slug}>
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



