import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatbuddy-ecf3a.firebaseapp.com",
  projectId: "chatbuddy-ecf3a",
  storageBucket: "chatbuddy-ecf3a.appspot.com",
  messagingSenderId: "496577446832",
  appId: "1:496577446832:web:24c74fc36cf96f847f0c75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore()
export const storage = getStorage()

