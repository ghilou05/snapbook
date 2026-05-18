import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyDvsJM3ipLThqf0LU6JAngMRaucjd-Az8E",
    authDomain: "greatunihack25.firebaseapp.com",
    projectId: "greatunihack25",
    storageBucket: "greatunihack25.firebasestorage.app",
    messagingSenderId: "679177014363",
    appId: "1:679177014363:web:3be987eff0c86d7e7a437e",
    measurementId: "G-WPNM0XFPVG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);