import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  onSnapshot,
  isFirebaseConfigured 
} from '../firebase/firestore';
import { getTodayString } from '../utils/dateUtils';

/**
 * Get challenge for today from Cloud Firestore
 */
export async function getTodayChallenge() {
  const today = getTodayString();
  return getChallengeByDate(today);
}

/**
 * Get challenge by specific YYYY-MM-DD date from Cloud Firestore
 */
export async function getChallengeByDate(dateStr) {
  if (!dateStr || !db) return null;

  try {
    const docRef = doc(db, 'problems', dateStr);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (err) {
    console.error(`Error fetching challenge for ${dateStr} from Firestore:`, err);
    throw err;
  }
}

/**
 * Get all published and scheduled challenges from Cloud Firestore
 */
export async function getAllChallenges() {
  if (!db) return [];

  try {
    const problemsRef = collection(db, 'problems');
    const q = query(problemsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (err) {
    console.error('Error fetching challenges from Firestore:', err);
    throw err;
  }
}

/**
 * Real-time subscription to a specific date's challenge
 */
export function subscribeToChallenge(dateStr, callback) {
  if (!db || !dateStr) {
    callback(null);
    return () => {};
  }

  const docRef = doc(db, 'problems', dateStr);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Firestore challenge listener error:', error);
    callback(null);
  });
}

/**
 * Create or update a daily challenge in Cloud Firestore
 * Document ID is the date (YYYY-MM-DD)
 */
export async function saveChallenge(problemData) {
  const { date, title, leetcodeURL, difficulty, topic, description } = problemData;

  if (!db) {
    throw new Error('Cloud Firestore is not initialized. Please configure Firebase.');
  }

  if (!date || !title || !leetcodeURL || !difficulty || !topic || !description) {
    throw new Error('All required challenge fields must be completed.');
  }

  const docRef = doc(db, 'problems', date);
  const existing = await getDoc(docRef);

  const dataToSave = {
    date,
    title: title.trim(),
    leetcodeURL: leetcodeURL.trim(),
    difficulty,
    topic: topic.trim(),
    description: description.trim(),
    updatedAt: serverTimestamp(),
    ...(!existing.exists() ? { createdAt: serverTimestamp() } : {})
  };

  await setDoc(docRef, dataToSave, { merge: true });
  return { id: date, ...dataToSave };
}

/**
 * Delete a challenge from Cloud Firestore
 */
export async function deleteChallenge(dateStr) {
  if (!db || !dateStr) return;
  const docRef = doc(db, 'problems', dateStr);
  await deleteDoc(docRef);
}
