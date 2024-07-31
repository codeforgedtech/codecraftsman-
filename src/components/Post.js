import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import Comment from './Comment';
import Loader from './Loader';
import '../styles/Post.css';

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      let { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();
      if (error) {
        console.log('Error fetching post:', error.message);
      } else {
        setPost(post);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchSimilarPosts = async () => {
      if (post && post.categories && post.categories.length > 0) {
        setLoadingSimilar(true);
        let { data: similarPosts, error } = await supabase
          .from('posts')
          .select('*')
          .contains('categories', post.categories)
          .neq('id', post.id)
          .limit(4);
  
        if (error) {
          console.log('Error fetching similar posts:', error.message);
        } else {
          setSimilarPosts(similarPosts);
        }
        setLoadingSimilar(false);
      }
    };
  
    fetchSimilarPosts();
  }, [post]);

  if (loading) {
    return <Loader />;
  }

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
          
          <div className="similar-posts">
            <h2>Similar Posts</h2>
            {loadingSimilar ? (
              <Loader />
            ) : (
              <div className="similar-posts-grid">
                {similarPosts.map((similarPost, index) => (
                  <Link to={`/post/${similarPost.slug}`} key={index} className="similar-post-item">
                    <img
                      src={similarPost.images && similarPost.images.length > 0 ? similarPost.images[0] : '/default-image.jpg'}
                      alt={similarPost.title}
                      className="similar-post-thumbnail"
                    />
                    <div className="similar-post-title">{similarPost.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      <div className="comment-section">
            <Comment postId={post.id} />
          </div>
    </div>
    
  );
};

export default Post;




