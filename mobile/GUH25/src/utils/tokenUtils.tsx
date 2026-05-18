import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const TOKEN_EXPIRY_KEY = '@auth_token_expiry';

interface TokenData {
    token: string;
    expiresAt: string;
}

export async function setToken(token: string, expiresInSeconds: number = 3600): Promise<void> {
    try {
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
        const tokenData: TokenData = { token, expiresAt };
        
        await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
    } catch (error) {
        console.error('Error saving token:', error);
        throw error;
    }
}

export async function getToken(): Promise<string | null> {
    try {
        const tokenDataString = await AsyncStorage.getItem(TOKEN_KEY);
        if (!tokenDataString) {
            return null;
        }

        const tokenData: TokenData = JSON.parse(tokenDataString);
        const now = new Date();
        const expiresAt = new Date(tokenData.expiresAt);

        // Check if token is expired
        if (now >= expiresAt) {
            console.log('Token expired, removing...');
            await removeToken();
            return null;
        }

        return tokenData.token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

export async function isTokenValid(): Promise<boolean> {
    const token = await getToken();
    return token !== null;
}

export async function removeToken(): Promise<void> {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token:', error);
        throw error;
    }
}

export function getUserIdFromToken(token: string): string {
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        return payload.userId || null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return '';
    }
}