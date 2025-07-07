// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {collection, getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "notes-app-384e8.firebaseapp.com",
  projectId: "notes-app-384e8",
  storageBucket: "notes-app-384e8.firebasestorage.app",
  messagingSenderId: "225168014728",
  appId: "1:225168014728:web:9408268eb454238b428e3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const notesCollection = collection(db, "notes");