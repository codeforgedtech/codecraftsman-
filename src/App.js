import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Post from './components/Post';
import Footer from './components/Footer';
import CreatePost from './components/CreatePost';
import Login from './components/Login';
import Admin from './components/Admin';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
  <Footer/>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
