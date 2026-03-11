// Firebase config for NCA Website
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSO7TZIEfrVSgHlRSdGJqf6fpolZX3tQM",
  authDomain: "nca-c1.firebaseapp.com",
  projectId: "nca-c1",
  storageBucket: "nca-c1.firebasestorage.app",
  messagingSenderId: "778290894704",
  appId: "1:778290894704:web:923786d418c5fe197d61b5",
  measurementId: "G-9PKH2Z4H34"
};

// Initialize Firebase only on client-side
let app;
let storage;
let db;
let auth;

if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  db = getFirestore(app);
  auth = getAuth(app);
} else if (typeof window !== 'undefined') {
  app = getApps()[0];
  storage = getStorage(app);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, storage, db, auth };
