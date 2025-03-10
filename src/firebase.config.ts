// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA958-n7q5_PPfBZKfWK0gdC_fscTjqf4g",
  authDomain: "dineeas-3bf35.firebaseapp.com",
  projectId: "dineeas-3bf35",
  storageBucket: "dineeas-3bf35.firebasestorage.app",
  messagingSenderId: "242344563782",
  appId: "1:242344563782:web:34e44a3d4cf229ad48a647",
  measurementId: "G-K7Y0X9ZSVS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
export { firebaseAuth, RecaptchaVerifier, signInWithPhoneNumber };
