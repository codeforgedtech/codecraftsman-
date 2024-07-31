import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../supabaseClient';
import logo from '../images/logotype.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

// Animation for sliding the menu in and out
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(100%);
  }
`;

const NavbarContainer = styled.nav`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  height: 120px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 3;
`;

const Logo = styled.img`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 15;
  }
`;

const MenuItem = styled(Link)`
  color: black;
  text-decoration: none;
  margin: 5px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px; 
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%; /* Ensures menu items take full width on mobile */

  &:hover {
    transform: scale(1.1);
    color: black;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 15px 0;
    font-size: 20px; 
    font-weight: 800;
    color: black; /* Change text color to black on mobile */
  }
`;

const HamburgerButton = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 45px;
  width: 45px;
  background-color: #333;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  position: fixed;
  top: 25px;
  right: 10px;
  z-index: 20;
 

  span {
    display: block;
    width: 25px;
    height: 3px;
    margin: 4px 0;
    background-color: white;
    transition: transform 0.3s, opacity 0.3s;
  }

  @media (max-width: 768px) {
    display: flex;
  }

  &.open span:nth-child(1) {
    transform: rotate(55deg) translate(10px, 5px);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: rotate(-55deg) translate(10px, -5px);
  }
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center; /* Center menu items horizontally */

  @media (max-width: 768px) {
    flex-direction: column;
    width: 50%; /* Full width on mobile */
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    background-color: white;
    transform: translateX(100%);
    animation: ${props => (props.open ? slideIn : slideOut)} 0.5s forwards;
    justify-content: flex-start;
    align-items: center;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
    padding-top: 65px;
    border-left: 2px solid black;
  }
`;



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
      if (error) throw error;
  
      // Force complete sign-out from Google
      window.location.href = 'https://accounts.google.com/Logout?continue=https://www.google.com';
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <NavbarContainer>
      <img src={logo} alt="logo" width={100} height={100} />
      <HamburgerButton className={isOpen ? 'open' : ''} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </HamburgerButton>

      <MenuItems open={isOpen}>
        {isOpen && <Logo src={logo} alt="logo" width={50} height={50} />}
        <MenuItem to="/" onClick={closeMenu}>Home</MenuItem>
        <MenuItem to="/about" onClick={closeMenu}>About</MenuItem>
        
        <MenuItem to="/archive" onClick={closeMenu}>Archive</MenuItem>
        {user && (
          <>
            {user.email === 'ch@star78.se' && (
              <>
                <MenuItem to="/create" onClick={closeMenu}>Create</MenuItem>
                <MenuItem to="/posts-manager" onClick={closeMenu}>Manage</MenuItem>
              </>
            )}
            <MenuItem  onClick={() => { signOut(); closeMenu(); }}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </MenuItem>
          </>
        )}
        {!user && (
          <MenuItem to="/login" onClick={closeMenu}>
            <FontAwesomeIcon icon={faSignInAlt} /> 
          </MenuItem>
        )}
      </MenuItems>
    </NavbarContainer>
  );
};

export default Navbar;










