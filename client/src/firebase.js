// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import dotenv from "dotenv";
// dotenv.config({ path: "../.env" });
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-2682e.firebaseapp.com",
    projectId: "mern-blog-2682e",
    storageBucket: "mern-blog-2682e.appspot.com",
    messagingSenderId: "767735113813",
    appId: "1:767735113813:web:1fa8fc666f76012b9f0cdc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
