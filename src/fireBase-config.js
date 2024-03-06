import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyAtiylCm230_1Dcfjlo41uGLE2xEn6P8do',
  authDomain: 'zing-mp3-a11ae.firebaseapp.com',
  projectId: 'zing-mp3-a11ae',
  storageBucket: 'zing-mp3-a11ae.appspot.com',
  messagingSenderId: '1043395588332',
  appId: '1:1043395588332:web:9bfe0b9cf8f6f3036575c9',
  measurementId: 'G-BB73MYFCHN',
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
