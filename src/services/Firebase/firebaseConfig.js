// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpDrfqPisMpldePPn-paEUv7vUfb8CME4",
  authDomain: "stuswift-eb2f0.firebaseapp.com",
  projectId: "stuswift-eb2f0",
  storageBucket: "stuswift-eb2f0.firebasestorage.app",
  messagingSenderId: "325110710893",
  appId: "1:325110710893:web:12636e4c72c389dd91f564",
  measurementId: "G-E8B8YTVKGJ"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH= getAuth(FIREBASE_APP);
export const FIRESTORE_DB= getFirestore(FIREBASE_APP);