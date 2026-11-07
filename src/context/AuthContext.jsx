import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGoogle, signOutUser, subscribeToAuth } from '../firebase/auth';
import { syncUserProfile, claimAdminRole } from '../services/userService';

const AuthContext = createContext(null);

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (authUser) => {
      setLoading(true);
      if (authUser) {
        try {
          const profile = await syncUserProfile(authUser);
          setCurrentUser(authUser);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error synchronizing user on auth state change:', err);
          const email = (authUser.email || '').toLowerCase();
          const isInitialAdmin = ADMIN_EMAILS.includes(email) || email === 'shadeedshaik1@gmail.com';
          setCurrentUser(authUser);
          setUserProfile({
            uid: authUser.uid,
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
            role: isInitialAdmin ? 'ADMIN' : 'USER'
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      const profile = await syncUserProfile(user);
      setCurrentUser(user);
      setUserProfile(profile);
      return { user, profile };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const promoteToAdmin = async () => {
    if (!currentUser) return;
    try {
      await claimAdminRole(currentUser.uid);
      setUserProfile(prev => ({ ...(prev || {}), role: 'ADMIN' }));
    } catch (err) {
      console.error('Failed to claim admin role:', err);
      throw err;
    }
  };

  const userEmail = (currentUser?.email || '').toLowerCase();
  const isAdmin = Boolean(
    userProfile?.role === 'ADMIN' ||
    ADMIN_EMAILS.includes(userEmail) ||
    userEmail === 'shadeedshaik1@gmail.com'
  );

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    role: isAdmin ? 'ADMIN' : (userProfile?.role || 'USER'),
    loading,
    loginWithGoogle,
    logout,
    promoteToAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
