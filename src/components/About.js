import React from 'react';
import '../styles/About.css'; // Import your CSS file
import profil from "../images/profil.jpg"
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <div className="about-container">
       <Helmet>
        <title>About Me | CodeCraftsMan</title>
        <meta name="description" content="Learn more about me. Discover my mission, vision, and what drives me to bring you the best in technology news and insights." />
        <meta name="keywords" content="about me, tech blog, technology news, my mission" />
      </Helmet>
      <header className="about-header">
        <div className="about-stamp">
          About me
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
            <p>My name is Christer Holm, and I originally hail from the charming town of Ronneby in Blekinge. In 2024, I made a significant move to Hofors in Gästrikland, a change that has invigorated my passion for technology and web development. Managing several online platforms is a big part of what I do, but this blog will serve as my primary outlet for sharing my projects, insights, and experiences with a broader audience.</p>

            <h2>What You Can Expect</h2>
            <ul>
              <li><strong>Project Updates:</strong> In this section, I will share regular updates on my current work. This includes detailed progress reports on ongoing projects, insights into the challenges I encounter, and previews of future plans. By following along, you'll get a behind-the-scenes look at the life cycle of various projects, from inception to completion.</li>
              <li><strong>Guides:</strong>I will craft detailed guides on a range of technical topics and tools. These guides are designed to be accessible, aiming to help you understand and utilize different technologies effectively. Whether you're a beginner or an experienced developer, you'll find step-by-step instructions and practical advice that you can apply to your own projects.</li>
              <li><strong>Coding Series:</strong> One of the most exciting parts of this blog will be the coding series. Here, I will break down the basics of coding into digestible lessons, walking you through each concept step by step. These series will be practical and easy to follow, enabling you to apply what you learn immediately. My goal is to demystify coding and make it accessible to everyone, regardless of their prior experience.</li>
            </ul>

            <h2>Skills and Knowledge</h2>
By following this blog, you will acquire the skills and knowledge needed to start and manage your own website independently. I will cover everything from fundamental coding principles to more advanced techniques, offering a comprehensive view of the development process. You'll gain insights into the best practices and methodologies that professional developers use, equipping you with the tools to create robust and efficient web applications.

<h2>Focus on Unique and Valuable Topics</h2>
While there are countless resources available online for learning how to use platforms like WordPress, my focus will be on unique and valuable topics that are less commonly addressed. I aim to provide content that fills the gaps left by more conventional guides, offering fresh perspectives and innovative solutions.

<h2>Join the Journey</h2>
I invite you to join me on this exciting journey as we explore the world of technology together. This blog will be a space for learning, growth, and creativity. Together, we'll dive into the depths of web development, unravel complex problems, and create amazing things. Whether you're looking to build your own website, improve your coding skills, or simply stay updated on the latest in technology, there's something here for you.

Thank you for visiting my blog. Let's embark on this adventure and make technology accessible and enjoyable for everyone!
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
