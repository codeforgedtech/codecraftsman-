import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Comment from './Comment';
import '../styles/Post.css';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      let { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.log('Error fetching post:', error);
      else setPost(post);
    };

    fetchPost();
  }, [id]);

  return (
    <div className="container post">
      {post && (
        <>
          <h1>{post.title}</h1>
          <div className="content">
            {post.images && post.images.length > 0 && (
              <div className="image-gallery">
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className={`image-text-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  >
                    <img
                      src={image}
                      alt={`Post image ${index}`}
                      className="post-image"
                    />
                  </div>
                ))}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          <div className="categories">
            <h4>Categories:</h4>
            <ul>
              {post.categories && post.categories.length > 0 ? (
                post.categories.map((category, index) => (
                  <li key={index}>{category}</li>
                ))
              ) : (
                <li>No categories</li>
              )}
            </ul>
          </div>
          <div className="comment-section">
            <Comment postId={post.id} />
          </div>
        </>
      )}
    </div>
  );
};

export default Post;