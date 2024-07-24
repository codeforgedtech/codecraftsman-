import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import Comment from './Comment';
import '../styles/Post.css';

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      let { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) console.log('Error fetching post:', error);
      else setPost(post);
    };

    fetchPost();
  }, [slug]);

  return (
    <div className="container post">
      {post && (
        <>
          <Helmet>
            <title>{post.title} | CodeCraftsMan</title>
            <meta name="description" content={post.excerpt || 'Read this post to find out more!'} />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.excerpt || 'Read this post to find out more!'} />
            <meta property="og:image" content={post.images && post.images.length > 0 ? post.images[0] : '/default-image.jpg'} />
            <meta property="og:url" content={`https://codecraftsman.se/post/${post.slug}`} />
            <meta property="og:type" content={post.title} />
            
          </Helmet>
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
          <div className="comment-section">
            <Comment postId={post.id} />
          </div>
        </>
      )}
    </div>
  );
};

export default Post;


