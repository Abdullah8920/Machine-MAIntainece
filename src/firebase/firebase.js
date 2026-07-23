
import { initializeApp, getApps, getApp } from "firebase/app";
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)

export { app, db };