// src/components/Pagination.js
import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    paginate(pageNumber);
    window.scrollTo(0, 0); // Scrolla till toppen av sidan
  };

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button onClick={() => handlePageClick(number)} className="page-link">
            {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;

