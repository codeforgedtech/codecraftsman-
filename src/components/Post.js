import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '../supabaseClient';
import Comment from './Comment';
import Loader from './Loader';
import {
  FacebookShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';
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

  useEffect(() => {
    if (post) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [post]);

  if (loading) {
    return <Loader />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const shareUrl = `https://codecraftsman.se/post/${post?.slug}`;
  const shareTitle = post.title || 'Check out this post!';
  const shareImage = post.images && post.images.length > 0 ? post.images[0] : '/default-image.jpg';

  return (
    <div className="container post">
      {post && (
        <>
          <Helmet>
            <title>{post.title} | CodeCraftsMan</title>
            <meta name="description" content={post.content || 'Read this post to find out more!'} />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.content || 'Read this post to find out more!'} />
            <meta property="og:url" content={shareUrl} />
            <meta property="og:type" content="article" />
            <meta property="og:image" content={shareImage} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={post.title} />
            <meta name="twitter:description" content={post.content || 'Read this post to find out more!'} />
            <meta name="twitter:image" content={shareImage} />
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "image": post.images && post.images.length > 0 ? post.images[0] : '/default-image.jpg',
                "author": {
                  "@type": "Person",
                  "name": post.author || 'Author Name'
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "CodeCraftsMan",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "/logo.png"
                  }
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://codecraftsman.se/post/${post.slug}`
                },
                "datePublished": post.created_at,
                "dateModified": post.updated_at
              })}
            </script>
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
                    <div className="image-container">
                      <img
                        src={image}
                        alt={`Post image ${index}`}
                        className="post-image"
                        loading="lazy"
                      />
                      <div className="post-date">{formatDate(post.created_at)}</div>
                    </div>
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

          <div className="tags">
            <h4>Tags</h4>
            <div className="tags-container">
              {post.tags && post.tags.length > 0 ? (
                post.tags.map((tag, index) => (
                  <Link to={`/tag/${tag}`} key={index} className="tag-link">
                    {tag}
                  </Link>
                ))
              ) : (
                <span>No tags</span>
              )}
            </div>
          </div>

          <div className="share-buttons">
            <FacebookShareButton url={shareUrl} quote={shareTitle}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
            <EmailShareButton body={shareTitle} url={shareUrl} subject={`Check out this post`}>
              <EmailIcon size={32} round />
            </EmailShareButton>
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



       



