import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAYDa295JymJZk6aFf4GU97l68UmjhLlc",
  authDomain: "rectangle-2aae7.firebaseapp.com",
  projectId: "rectangle-2aae7",
  storageBucket: "rectangle-2aae7.appspot.com",
  messagingSenderId: "760481259579",
  appId: "1:760481259579:web:657858d70a84c58bae3c1e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);