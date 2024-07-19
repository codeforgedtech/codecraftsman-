import React from 'react';
import '../styles/Footer.css'; // Importera CSS-stilfilen för footern

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>About Me</h2>
          <p>I’m Christer Holm, and I run CodeCraftsMan, a blog where I showcase my latest projects and explore new technologies. </p>
        </div>
        
        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p>Email: info@codeforged.se</p>
          <p>Phone: +46 736 55 0614</p>
        </div>
        <div className="footer-section socials">
          <h2>Follow Us</h2>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CodeCraftsMan.se All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
