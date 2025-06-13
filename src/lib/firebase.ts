
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// إعدادات Firebase الجديدة
const firebaseConfig = {
  apiKey: "AIzaSyD233UERpyRiw1GwBOaWrkWWl8VRo5z4kE",
  authDomain: "ysmart-edu-app.firebaseapp.com",
  projectId: "ysmart-edu-app",
  storageBucket: "ysmart-edu-app.firebasestorage.app",
  messagingSenderId: "882580783531",
  appId: "1:882580783531:web:1c2810ffd7b7a9a45c12ee",
  measurementId: "G-7K6DEV3TVZ"
};

// تجنب إنشاء تطبيق مكرر
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

console.log('Firebase initialized successfully');
console.log('Project ID:', firebaseConfig.projectId);

export default app;
