import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYH6x5tzCRgi3Ce9LLKnTx9-iyBtk5EzM",
  authDomain: "data-entry-cb80b.firebaseapp.com",
  projectId: "data-entry-cb80b",
  storageBucket: "data-entry-cb80b.firebasestorage.app",
  messagingSenderId: "386780819588",
  appId: "1:386780819588:web:7776c6326d5a8fbbacd2d1",
  measurementId: "G-B7RL9BFMVR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { app, auth, db };