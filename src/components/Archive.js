import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import Pagination from './Pagination';
import '../styles/Archive.css';

const Archive = () => {
  const [archiveData, setArchiveData] = useState({});
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
  .from('posts')
  .select('id, title, created_at, categories, images, slug') 
          if (error) {
          throw error;
        }

        const sortedData = data.reduce((acc, post) => {
          const date = new Date(post.created_at);
          const year = date.getFullYear();
          const month = date.toLocaleString('default', { month: 'long' });

          if (!acc[year]) acc[year] = {};
          if (!acc[year][month]) acc[year][month] = [];

          acc[year][month].push(post);
          return acc;
        }, {});

        setArchiveData(sortedData);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
        setError(`Error fetching posts: ${error.message}`);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const monthOptions = [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'juli', label: 'Juli' },
    { value: 'augusti', label: 'Augusti' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'movember', label: 'November' },
    { value: 'december', label: 'December' }
  ];

  const yearOptions = Object.keys(archiveData).map(year => ({
    value: year,
    label: year
  }));

  const filteredArchiveData = Object.entries(archiveData)
    .filter(([year]) => !selectedYear || year === selectedYear.value)
    .reduce((acc, [year, months]) => {
      acc[year] = selectedMonth ? { [selectedMonth.value]: months[selectedMonth.value] || [] } : months;
      return acc;
    }, {});

  const allPosts = Object.entries(filteredArchiveData).flatMap(([year, months]) => 
    Object.entries(months).flatMap(([month, posts]) => posts)
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when filters change
  }, [selectedYear, selectedMonth]);

  const getDisplayTitle = () => {
    if (selectedYear && selectedMonth) {
      return `${selectedMonth.label} ${selectedYear.value}`;
    } else if (selectedYear) {
      return selectedYear.value;
    } else if (selectedMonth) {
      return selectedMonth.label;
    } else {
      return 'Archive';
    }
  };

  return (
    <div className="archive">
      <Helmet>
        <title>Archive | CodeCraftsMan</title>
        <meta name="description" content="Browse through our archive of blog posts on technology, programming, and more. Discover older posts that might interest you." />
        <meta name="keywords" content="tech blog archive, programming, technology, older posts" />
      </Helmet>
     
      {error && <div className="error">{error}</div>}
      <div className="filter">
        <Select
          value={selectedYear}
          onChange={setSelectedYear}
          options={yearOptions}
          placeholder="Select year"
          isClearable
          classNamePrefix="react-select"
        />
        <Select
          value={selectedMonth}
          onChange={setSelectedMonth}
          options={monthOptions}
          placeholder="Select month"
          isClearable
          classNamePrefix="react-select"
        />
      </div>
      <div className="posts-container">
        <div className="year-stamp">{getDisplayTitle()}</div>
        {currentPosts.length > 0 ? (
          currentPosts.map(post => (
            <div key={post.id} className="archive-post">
              <div className="date-box">
                {formatDate(post.created_at)}
              </div>
              <div className="post-details">
                {post.images && post.images.length > 0 && (
                  <img src={post.images[0]} alt={post.title} className="thumbnail" />
                )}
                <div className="post-info">
                <Link to={`/post/${post.slug}`} className="post-title">{post.title}</Link>
                  <div className="categories">
                    <h4>Categories</h4>
                    <ul>
                      {post.categories && post.categories.length > 0 ? (
                        post.categories.map((category, index) => (
                          <li key={index}>
                            <Link to={`/category/${category}`} className="category-link">
                              {category}
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li>No categories</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={allPosts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Archive;
