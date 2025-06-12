
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// إعدادات Firebase بناءً على المعلومات الموجودة في الصورة
const firebaseConfig = {
  apiKey: "AIzaSyD233UERpyR1W1GwBQaWrkWNl8VRo5z4kE",
  authDomain: "ysmart-edu-app.firebaseapp.com",
  projectId: "ysmart-edu-app",
  storageBucket: "ysmart-edu-app.firebasestorage.app",
  messagingSenderId: "882580783531",
  appId: "1:882580783531:web:1c2810ffd7b7a9a45c12ee",
  measurementId: "G-7K6DEV3TVZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
