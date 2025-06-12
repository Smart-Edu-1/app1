
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // These would normally come from environment variables
  // For demo purposes, using placeholder values
  apiKey: "demo-api-key",
  authDomain: "smart-edu-demo.firebaseapp.com",
  projectId: "smart-edu-demo",
  storageBucket: "smart-edu-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
