import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: "digital-oasis-35451",
  storageBucket: "digital-oasis-35451.appspot.com",
  messagingSenderId: process.env.SENDER_ID,
  appId: "1:263797926684:web:aeaa3b5aa9bfdc264768d9",
  measurementId: "G-0161DQQTBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage=getStorage(app)
export {storage}