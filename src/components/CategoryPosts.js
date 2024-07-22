import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../styles/CategoryPosts.css';

const CategoryPosts = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .contains('categories', [category]) // Correct query to check if 'categories' array contains the given category
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching posts by category:', error);
      } else {
        setPosts(posts);
      }
    };

    fetchPostsByCategory();
  }, [category]);

  return (
    <div className="container category-posts">
      <div className="stamp">
        <h1>{category}</h1>
      </div>
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="post-link">
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
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPosts;
