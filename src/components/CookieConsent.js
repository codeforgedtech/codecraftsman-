import React, { useState, useEffect } from 'react';
import '../styles/CookieConsent.css'; // You'll style it here

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-consent-modal">
      <div className="cookie-consent-content">
        <p>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
        </p>
        <button onClick={acceptCookies}>Accept</button>
      </div>
    </div>
  );
};

export default CookieConsent;