import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import googleLogo from '../images/google-logo.png'; // Ladda in Google-logotypen

const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Error logging in with Google:', error.message);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: user, error } = await supabase
            .from('users')
            .select('isAdmin')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user:', error.message);
            return;
          }

          if (user.isAdmin) {
            navigate('/admin'); // Omdirigera administratören till admin-sidan
          } else {
            navigate('/home'); // Omdirigera vanliga användare till home-sidan
          }
        }
      });

      return () => {
        authListener?.unsubscribe?.();
      };
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="login">
      <button onClick={signInWithGoogle} className="google-signin-button">
        <img src={googleLogo} alt="Google logo" className="google-logo" />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;

