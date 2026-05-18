import { StatusBar } from 'expo-status-bar';
import FontProvider from './src/utils/FontProvider';
import Routing from './src/routing/Routing';
import useIdentityInitialiser from './src/store/identity/useIdentityInitialiser';

export default function Main() {
    // Initialize Firebase auth state listener
    useIdentityInitialiser();

    return (
        <FontProvider>
            <Routing />
            <StatusBar style="auto" />
        </FontProvider>
    );
}