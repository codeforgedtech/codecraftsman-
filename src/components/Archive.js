import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Select from 'react-select'; // Import React Select
import '../styles/Archive.css';

const Archive = () => {
  const [archiveData, setArchiveData] = useState({});
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // State for selected month

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, created_at, categories, images')
          .order('created_at', { ascending: false });

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
    { value: 'january', label: 'january' },
    { value: 'february', label: 'february' },
    { value: 'march', label: 'march' },
    { value: 'april', label: 'april' },
    { value: 'may', label: 'may' },
    { value: 'june', label: 'june' },
    { value: 'juli', label: 'juli' },
    { value: 'augusti', label: 'augusti' },
    { value: 'september', label: 'september' },
    { value: 'october', label: 'october' },
    { value: 'november', label: 'november' },
    { value: 'december', label: 'december' }
  ];

  const filteredArchiveData = selectedMonth
    ? Object.fromEntries(
        Object.entries(archiveData).map(([year, months]) => [
          year,
          { [selectedMonth.value]: months[selectedMonth.value] || [] }
        ])
      )
    : archiveData;

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
          value={selectedMonth}
          onChange={setSelectedMonth}
          options={monthOptions}
          placeholder="Select month"
          isClearable
        />
      </div>
      {Object.keys(filteredArchiveData).length > 0 ? (
        Object.entries(filteredArchiveData).map(([year, months]) => (
          <div key={year} className="archive-year">
            <div className="year-stamp">{year}</div>
            {Object.entries(months).map(([month, posts]) => (
              <div key={month} className="archive-month">
                <h3>{month}</h3>
                <ul>
                  {posts.map(post => (
                    <li key={post.id} className="archive-post">
                      <div className="date-box">
                        {formatDate(post.created_at)}
                      </div>
                      <div className="post-details">
                        {post.images && post.images.length > 0 && (
                          <img src={post.images[0]} alt={post.title} className="thumbnail" />
                        )}
                        <div className="post-info">
                          <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
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
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default Archive;







