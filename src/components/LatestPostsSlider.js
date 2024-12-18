import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import '../styles/LatestPostsSlider.css'; // Custom CSS for additional styling

const LatestPostsSlider = ({ posts }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container">
      <h2>Latest Posts</h2>
      <Slider {...settings}>
        {posts.slice(0, 10).map(post => (
          <div key={post.id} className="slider-item">
            <Link to={`/post/${post.id}`} className="slider-link">
              {post.images && post.images.length > 0 && (
                <img src={post.images[0]} alt="Post thumbnail" className="slider-image" />
              )}
              <div className="slider-info">
                <h3>{post.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) }} />
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default LatestPostsSlider;