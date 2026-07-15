// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVXS69h26VUIBdfJH9NLjQoZJAnGgBa_k",
    authDomain: "novel-5693b.firebaseapp.com",
    projectId: "novel-5693b",
    storageBucket: "novel-5693b.firebasestorage.app",
    messagingSenderId: "206020941652",
    appId: "1:206020941652:web:f6ea2109ac5ca9fc479ac1",
    measurementId: "G-0J926LD9J5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);