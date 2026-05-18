import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvsJM3ipLThqf0LU6JAngMRaucjd-Az8E",
  authDomain: "greatunihack25.firebaseapp.com",
  projectId: "greatunihack25",
  storageBucket: "greatunihack25.firebasestorage.app",
  messagingSenderId: "679177014363",
  appId: "1:679177014363:web:3be987eff0c86d7e7a437e",
  measurementId: "G-WPNM0XFPVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
