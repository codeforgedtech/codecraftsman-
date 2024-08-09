import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/CategoryPosts.css';

const postsPerPage = 5; // Antal inlägg per sida

const CategoryPosts = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPostsByTags = async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .contains('tags', [tag])
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching posts by tags:', error);
      } else {
        setPosts(posts);
        setCurrentPage(1); // Reset to first page on tags change
      }
    };

    fetchPostsByTags();
  }, [tag]);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container category-posts">
      <div className="stamp">
        {tag}
      </div>
      <div className="posts-list">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <Link key={post.slug} to={`/post/${post.slug}`} className="post-link">
              {post.images && post.images.length > 0 && (
                <img src={post.images[0]} alt="Post thumbnail" className="post-thumbnail" />
              )}
              <div className="post-info">
                <h2>{post.title}</h2>
                <p dangerouslySetInnerHTML={{ __html: post.content.substring(0, 600) }} />
              </div>
            </Link>
          ))
        ) : (
          <p>No tags Found.</p>
        )}
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
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

export default CategoryPosts;
