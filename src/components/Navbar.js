import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { supabase } from '../supabaseClient';
import '../styles/Navbar.css';
import logo from '../images/logotype.png';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      navigate('/'); // Redirect to home after sign out
      window.location.href = 'https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/';
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleStateChange = (state) => {
    setIsOpen(state.isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/links">Links</Link>
        <Link to="/archive">Archive</Link>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            {user.email === 'ch@star78.se' && <Link to="/create" className="nav-button-create">Create Post</Link>}
            <button onClick={signOut} className="nav-button">Log Out</button>
          </>
        ) : (
          <Link to="/login" className="nav-button">Login</Link>
        )}
      </div>
      <Menu right isOpen={isOpen} onStateChange={handleStateChange}>
        <Link to="/" className="bm-item" onClick={closeMenu}>Home</Link>
        <Link to="/about" className="bm-item" onClick={closeMenu}>About</Link>
        <Link to="/links" className="bm-item" onClick={closeMenu}>Links</Link>
        <Link to="/archive" className="bm-item" onClick={closeMenu}>Archive</Link>
        {user ? (
          <>
            {user.email === 'ch@star78.se' && <Link to="/create" className="bm-item nav-button-create" onClick={closeMenu}>Create Post</Link>}
            <button onClick={() => { signOut(); closeMenu(); }} className="bm-item nav-button">Log Out</button>
          </>
        ) : (
          <Link to="/login" className="bm-item" onClick={closeMenu}>Login</Link>
        )}
      </Menu>
    </nav>
  );
};

export default Navbar;

