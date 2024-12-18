import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Comments.css';
import '../styles/Modal.css';
import googleLogo from '../images/google-logo.png';
import Modal from './Modal';

const Comment = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await saveUserToDatabase(session.user);
        } else {
          console.log('No user session found.');
        }
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        saveUserToDatabase(session.user);
      }
    });

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []);

  const saveUserToDatabase = async (user) => {
    try {
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
          },
        ]);

        if (insertError) {
          throw insertError;
        }

        console.log('User saved to database:', user);
      }
    } catch (error) {
      console.error('Error saving user to database:', error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

      console.log('User signed in:', user);
      setUser(user);
      await saveUserToDatabase(user);
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);

      // Force a complete sign-out to ensure Google account selection upon next login
      window.location.href = 'https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/';
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      if (!comment.trim()) {
        console.log('Comment content is empty');
        return;
      }

      if (!postId) {
        console.log('Post ID is missing');
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            content: comment,
            user_id: user.id,
            user_name: user.user_metadata.full_name,
            user_email: user.email,
          },
        ])
        .single();

      if (error) {
        throw error;
      }

      setComments([...comments, data]);
      setComment('');
      setModalMessage('Comment posted successfully!');
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
        window.location.reload();
      }, 2000); // Dismiss the modal after 2 seconds and reload the page
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  const handleReplySubmit = async () => {
    try {
      if (!reply.trim() || replyToCommentId === null) {
        console.log('Reply content is empty or no comment selected');
        return;
      }

      const { data, error } = await supabase
        .from('replies')
        .insert([
          {
            comment_id: replyToCommentId,
            content: reply,
            user_id: user.id,
            user_name: user.user_metadata.full_name,
            user_email: user.email,
          },
        ])
        .single();

      if (error) {
        throw error;
      }

      const updatedComments = comments.map(c => 
        c.id === replyToCommentId ? { ...c, replies: [...(c.replies || []), data] } : c
      );
      setComments(updatedComments);
      setReply('');
      setReplyToCommentId(null);
      setModalMessage('Reply posted successfully!');
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
        window.location.reload();
      }, 2000); // Dismiss the modal after 2 seconds and reload the page
    } catch (error) {
      console.error('Error adding reply:', error.message);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            *, 
            replies (
              *
            )
          `)
          .eq('post_id', postId);

        if (error) {
          throw error;
        }

        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
      <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} message={modalMessage} />
      {user ? (
        <>
          <textarea
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="button-container">
            <button onClick={handleCommentSubmit}>Submit</button>
            <button onClick={signOut}>Log Out</button>
          </div>

          {replyToCommentId && (
            <>
              <textarea
                placeholder="Add a reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <div className="button-container">
                <button onClick={handleReplySubmit}>Submit Reply</button>
                <button onClick={() => setReplyToCommentId(null)}>Cancel</button>
              </div>
            </>
          )}
        </>
      ) : (
        <div>
          <p>Please log in to comment.</p>
          <button className="google-login-button" onClick={signInWithGoogle}>
            <img src={googleLogo} alt="Google logo" className="google-logo" />
            Sign in with Google
          </button>
        </div>
      )}
      <div>
        {comments.length > 0 ? (
          comments.map((c, index) => (
            c && c.content ? (
              <div className="comment" key={index}>
                <p><strong>{c.user_name || 'Unknown User'}</strong> ({c.user_email || 'No email'})</p>
                <p>{c.content}</p>
                <button onClick={() => setReplyToCommentId(c.id)}>Reply</button>
                {c.replies && c.replies.length > 0 && (
                  <div className="replies">
                    {c.replies.map((r, rIndex) => (
                      r && r.content ? (
                        <div className="reply" key={rIndex}>
                          <p><strong>{r.user_name || 'Unknown User'}</strong> ({r.user_email || 'No email'})</p>
                          <p>{r.content}</p>
                        </div>
                      ) : null
                    ))}
                  </div>
                )}
              </div>
            ) : null
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comment;




  








