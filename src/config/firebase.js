// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQhgj6Z7Jnm8RXCpjIEqesEAi82zltF0g",
  authDomain: "train-times-43c64.firebaseapp.com",
  projectId: "train-times-43c64",
  storageBucket: "train-times-43c64.appspot.com",
  messagingSenderId: "355550049210",
  appId: "1:355550049210:web:8c356d1f3ee6bba8f42383",
  measurementId: "G-MK69E1Q38B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);