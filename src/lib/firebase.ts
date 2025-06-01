import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKvPsyaGuoJ87zpx_7oq8Sy7WQqVkNir4",
  authDomain: "summaid-da724.firebaseapp.com",
  projectId: "summaid-da724",
  storageBucket: "summaid-da724.firebasestorage.app",
  messagingSenderId: "718116303638",
  appId: "1:718116303638:web:bb056e7c59c690d4af1637",
  measurementId: "G-6ZG4FSJHXC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, provider);
