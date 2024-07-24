import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Post from './components/Post';
import Footer from './components/Footer';

import CategoryPosts from './components/CategoryPosts';
import Login from './components/Login';
import Archive from './components/Archive';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import PostsManager from './components/PostsManager'; // Importera PostsManager
import CreatePost from './components/CreatePost';
import PrivateRoute from './components/PrivatRouter';
import About from './components/About';
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/category/:category" element={<CategoryPosts />} />          
          <Route path="/login" element={<Login />} />
        <Route path='/archive' element={<Archive/>}/>
        <Route path="/about" element={<About/>} />

          <Route path="/create" element={<PrivateRoute element={<CreatePost />} />} />
          <Route path="/posts-manager" element={<PrivateRoute element={<PostsManager />} />} />
        </Routes>
  <Footer/>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
