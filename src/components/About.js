import React from 'react';
import '../styles/About.css'; // Import your CSS file
import profil from "../images/profil.jpg"
const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <div className="year-stamp">
          <span>About me</span>
        </div>
      </header>
      <section className="about-content">
        <div className="profile-section">
          <img
            src={profil}
            alt="Profile"
            className="profile-picture"
          />
          <div className="text-content">
            <p>My name is Christer Holm, and I originally hail from Ronneby in Blekinge. In 2024, I relocated to Hofors in Gästrikland. With a passion for technology and web development, I manage several online platforms, but this blog will be my primary space for sharing my projects, insights, and experiences.</p>

            <h2>What You Can Expect</h2>
            <ul>
              <li><strong>Project Updates:</strong> I will write about my current work, including ongoing projects and future plans.</li>
              <li><strong>Guides:</strong> Detailed guides on various technical topics and tools, designed to help you understand and use them effectively.</li>
              <li><strong>Coding Series:</strong> I will create series where I walk through the basics of coding step by step. These series will be designed to be easy to understand and practical, allowing you to apply what you learn immediately.</li>
            </ul>

            <p>By following this blog, you will gain the knowledge and skills needed to start and manage your own website independently. I will cover everything from fundamental coding principles to more advanced techniques, providing insights into the entire development process.</p>

            <p>What I won’t be covering here is how to use WordPress, as there are already numerous guides available online. Instead, I will focus on unique and valuable topics that are less commonly addressed.</p>

            <p>Welcome to join me on this journey as we explore the world of technology together. Let’s learn, grow, and create amazing things!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;