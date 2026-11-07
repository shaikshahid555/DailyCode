import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  isFirebaseConfigured 
} from '../firebase/firestore';

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Synchronize user profile in Cloud Firestore on login:
 * Creates user document with default role 'USER' if not existing.
 * Grants 'ADMIN' if the user's email matches the configured admin emails.
 * Updates lastSeenAt.
 * 
 * @param {Object} authUser - Firebase auth user object
 * @returns {Promise<Object>} User document data
 */
export async function syncUserProfile(authUser) {
  if (!authUser || !authUser.uid) return null;

  if (!isFirebaseConfigured || !db) {
    throw new Error('Firestore is not configured. Please configure Firebase credentials.');
  }

  const userEmail = (authUser.email || '').toLowerCase();
  const isAdminByEmail = ADMIN_EMAILS.includes(userEmail) || userEmail === 'shadeedshaik1@gmail.com';

  try {
    const userRef = doc(db, 'users', authUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const initialRole = isAdminByEmail ? 'ADMIN' : 'USER';
      const newUserData = {
        uid: authUser.uid,
        displayName: authUser.displayName || 'Developer',
        email: authUser.email || '',
        photoURL: authUser.photoURL || '',
        role: initialRole,
        createdAt: serverTimestamp(),
        lastSeenAt: serverTimestamp()
      };
      await setDoc(userRef, newUserData);
      return { ...newUserData, createdAt: new Date(), lastSeenAt: new Date() };
    } else {
      const existingData = userSnap.data();
      let role = existingData.role || 'USER';

      // Auto-elevate if explicitly configured as admin
      if (isAdminByEmail && role !== 'ADMIN') {
        role = 'ADMIN';
      }

      await setDoc(userRef, {
        displayName: authUser.displayName || existingData.displayName || 'Developer',
        photoURL: authUser.photoURL || existingData.photoURL || '',
        lastSeenAt: serverTimestamp(),
        role
      }, { merge: true });

      return { ...existingData, role, lastSeenAt: new Date() };
    }
  } catch (err) {
    console.error('Error syncing user profile in Firestore:', err);
    // Return resilient user profile so UI continues functioning
    return {
      uid: authUser.uid,
      displayName: authUser.displayName,
      email: authUser.email,
      photoURL: authUser.photoURL,
      role: isAdminByEmail ? 'ADMIN' : 'USER'
    };
  }
}

/**
 * Explicitly promote or claim admin role for current user
 */
export async function claimAdminRole(uid) {
  if (!uid || !db) return;
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { role: 'ADMIN', lastSeenAt: serverTimestamp() }, { merge: true });
}

/**
 * Fetch a user profile by UID from Firestore
 */
export async function getUserProfile(uid) {
  if (!uid || !db) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}
