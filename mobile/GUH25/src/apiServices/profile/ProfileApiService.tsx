import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export interface ProfileData {
    username: string;
    email: string;
    createdAt: string;
}

export async function getProfile(userId: string) {
    try {
        const profileRef = doc(db, 'users', userId);
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
            return profileSnap.data();
        } else {
            throw new Error('Profile not found');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        console.log('UserId:', userId);
        throw error;
    }
}

export async function setProfile(userId: string, profileData: ProfileData) {
    try {
        const profileRef = doc(db, 'users', userId);
        await setDoc(profileRef, profileData);
    } catch (error) {
        console.error('Error setting profile:', error);
        throw error;
    }
}

export async function getCountries(userId: string) {
    try {
        const countriesRef = doc(db, 'images', userId);
        const countriesSnap = await getDoc(countriesRef);
        
        if (countriesSnap.exists()) {
            //format into array
            const data = countriesSnap.data();
            return data; // Add this return statement
        } else {
            return {}; // Return empty object if no data found
        }
    } catch (error) {
        console.error('Error fetching countries data:', error);
        throw error;
    }
}