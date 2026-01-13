// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Add Realtime Database import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhG3aI_r16XsSe7n3xQ5V7r01pP41FHZE",
  authDomain: "autosnip-7948b.firebaseapp.com",
  projectId: "autosnip-7948b",
  storageBucket: "autosnip-7948b.appspot.com",
  messagingSenderId: "166558743492",
  appId: "1:166558743492:web:3888012c736e393a480291",
  measurementId: "G-GDGEPRNL6F",
  databaseURL: "https://autosnip-7948b-default-rtdb.firebaseio.com" // Add Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app); // Initialize Realtime Database

export { app, db, auth, realtimeDb }; // Export realtimeDb