// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {collection, getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCftnPC7jAaTqYHkHmsP_S6Sn4s0F5WIYs",
  authDomain: "notes-app-384e8.firebaseapp.com",
  projectId: "notes-app-384e8",
  storageBucket: "notes-app-384e8.firebasestorage.app",
  messagingSenderId: "225168014728",
  appId: "1:225168014728:web:9408268eb454238b428e3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");