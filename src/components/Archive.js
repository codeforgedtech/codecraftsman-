import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../styles/Archive.css';

const Archive = () => {
  const [archiveData, setArchiveData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, created_at, categories, images') // Include categories and thumbnail_url
          .order('created_at', { ascending: false }); // Fetch posts in descending order by creation date

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
    return date.getDate(); // Returns the day of the month
  };

  return (
    <div className="archive">
  
      {error && <div className="error">{error}</div>}
      {Object.keys(archiveData).length > 0 ? (
        Object.entries(archiveData).map(([year, months]) => (
          <div key={year} className="archive-year">
            <h2>{year}</h2>
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
                        <img src={post.images} alt={post.title} className="thumbnail" />
                        <div className="post-info">
                          <Link to={`/post/${post.id}`} className="post-title">{post.title}</Link>
                          <div className="categories">
                            {Array.isArray(post.categories) ? (
                              post.categories.map((category, index) => (
                                <span key={index} className="category">{category}</span>
                              ))
                            ) : (
                              <span className="category">{post.categories}</span>
                            )}
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


