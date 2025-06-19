// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUQVL3bODxL_rssHLW1E9KS8kV0EbnLY8",
  authDomain: "code--wallet.firebaseapp.com",
  projectId: "code--wallet",
  storageBucket: "code--wallet.firebasestorage.app",
  messagingSenderId: "115497141042",
  appId: "1:115497141042:web:9297f33e9d75b76faccd2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
const db = getFirestore(app);

export { db};