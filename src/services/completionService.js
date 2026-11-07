import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  onSnapshot,
  isFirebaseConfigured 
} from '../firebase/firestore';

/**
 * Mark a daily challenge completed in Cloud Firestore
 * Path: completions/{userId}/days/{date}
 * 
 * @param {string} userId 
 * @param {Object} problem 
 * @returns {Promise<Object>} completion record
 */
export async function markProblemCompleted(userId, problem) {
  if (!userId) {
    throw new Error('User must be logged in to record completion.');
  }
  if (!problem || !problem.date) {
    throw new Error('Invalid problem data.');
  }
  if (!db) {
    throw new Error('Cloud Firestore is not initialized.');
  }

  const date = problem.date;
  const compDocRef = doc(db, 'completions', userId, 'days', date);
  const existing = await getDoc(compDocRef);
  if (existing.exists()) {
    return { id: existing.id, ...existing.data(), alreadyCompleted: true };
  }

  const completionData = {
    userId,
    problemId: problem.id || date,
    date,
    problemTitle: problem.title || 'Daily Challenge',
    completedAt: serverTimestamp()
  };

  await setDoc(compDocRef, completionData);
  return { ...completionData, completedAt: new Date() };
}

/**
 * Check if a user has completed a challenge on a specific date in Firestore
 */
export async function checkIsDateCompleted(userId, dateStr) {
  if (!userId || !dateStr || !db) return false;
  const compDocRef = doc(db, 'completions', userId, 'days', dateStr);
  const snap = await getDoc(compDocRef);
  return snap.exists();
}

/**
 * Get all completion records for a user from Firestore
 */
export async function getUserCompletions(userId) {
  if (!userId || !db) return [];

  try {
    const daysColRef = collection(db, 'completions', userId, 'days');
    const q = query(daysColRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (err) {
    console.error('Error fetching user completions from Firestore:', err);
    throw err;
  }
}

/**
 * Real-time subscription to user completions in Firestore
 */
export function subscribeToUserCompletions(userId, callback) {
  if (!userId || !db) {
    callback([]);
    return () => {};
  }

  const daysColRef = collection(db, 'completions', userId, 'days');
  const q = query(daysColRef, orderBy('date', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const list = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    callback(list);
  }, (error) => {
    console.error('Error listening to user completions:', error);
    callback([]);
  });
}
