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
          <a href="https://www.facebook.com/saraldor" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.linkedin.com/company/codeforged/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.instagram.com/codeforged/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CodeCraftsMan.se All rights reserved.</p>
        <p>Forged by <a href="https://www.codeforged.se" target="_blank" rel="noopener noreferrer">CodeForged</a></p>
      </div>
    </footer>
  );
};

export default Footer;

