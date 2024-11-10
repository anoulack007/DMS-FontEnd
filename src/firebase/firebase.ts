// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGkuiB85Z3ZU0gSslWXPGHllUpRYnfUpw",
  authDomain: "documnet-cloud-storage.firebaseapp.com",
  projectId: "documnet-cloud-storage",
  storageBucket: "documnet-cloud-storage.firebasestorage.app",
  messagingSenderId: "550071417921",
  appId: "1:550071417921:web:c6ab758f0316a4ab369ac0",
  measurementId: "G-EFF9E6NPQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);