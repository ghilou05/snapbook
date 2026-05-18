import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useAppDispatch } from "../hooks";
import { setUser, logout } from "./identitySlice";
import { User } from "./identityState";

export default function useIdentityInitialiser() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const user: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                };
                
                // Check if user has completed onboarding by checking if profile exists
                // For now, we'll assume they need onboarding if they just signed up
                // You can enhance this by checking Firestore for a profile
                dispatch(setUser(user));
                console.log('User authenticated:', firebaseUser.uid);
            } else {
                // User is signed out
                dispatch(logout());
                console.log('User signed out');
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [dispatch]);
}