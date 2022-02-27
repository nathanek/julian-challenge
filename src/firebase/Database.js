// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase, ref, onValue} from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import 'firebase/database';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfTORuF8l8q9a8jOo1owWVsfZs_-7BqWQ",
  authDomain: "pushup-counter-b2b7c.firebaseapp.com",
  projectId: "pushup-counter-b2b7c",
  storageBucket: "pushup-counter-b2b7c.appspot.com",
  messagingSenderId: "376510463350",
  appId: "1:376510463350:web:6aecc478ae46e70afe4e57",
  measurementId: "G-2V3VQSJL1R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebase_app);

const db = getDatabase(app);

const auth = getAuth(app);

export {db, app, auth};
