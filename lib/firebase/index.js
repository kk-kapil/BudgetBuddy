// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG2xCbuazKDWeOCxN58Df-7XnpBwY2iQk",
  authDomain: "budget-buddy-153ca.firebaseapp.com",
  projectId: "budget-buddy-153ca",
  storageBucket: "budget-buddy-153ca.appspot.com",
  messagingSenderId: "25283159894",
  appId: "1:25283159894:web:f18d90b2937ba2c24958f7",
  measurementId: "G-5K2V62GX2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {app , db , auth}