// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEcxC_pY6aYmyUdvgtv8eo6eK_pyCdVcY",
  authDomain: "pern2-b12dc.firebaseapp.com",
  projectId: "pern2-b12dc",
  storageBucket: "pern2-b12dc.firebasestorage.app",
  messagingSenderId: "169822105257",
  appId: "1:169822105257:web:d115f3ca7a8554065703b8",
  measurementId: "G-KTFM17NG4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {app,auth};