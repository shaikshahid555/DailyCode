import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged as fbOnAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './config';

/**
 * Actual Google OAuth Sign-in using Firebase Authentication
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase Authentication is not configured. Please set your VITE_FIREBASE_* environment variables in .env');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    // Provide user-friendly error messages for common Firebase Auth issues
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled. Please complete the Google sign-in popup.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by your browser. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized in your Firebase Console. Please add it under Authentication > Settings > Authorized Domains.');
    } else if (error.code === 'auth/invalid-api-key') {
      throw new Error('Invalid Firebase API key. Please check your VITE_FIREBASE_API_KEY in .env.');
    }
    throw error;
  }
}

/**
 * Sign out current user from Firebase Auth
 */
export async function signOutUser() {
  if (!auth) return;
  return fbSignOut(auth);
}

/**
 * Subscribe to actual Firebase Auth state changes
 */
export function subscribeToAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return fbOnAuthStateChanged(auth, callback);
}
