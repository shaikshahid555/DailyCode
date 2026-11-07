import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

export {
  db,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  onSnapshot,
  Timestamp,
  isFirebaseConfigured
};
