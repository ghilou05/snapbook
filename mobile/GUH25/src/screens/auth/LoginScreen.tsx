import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Status } from '../../common/interfaces/Fetch';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { User } from '../../store/identity/identityState';
import { setUser } from '../../store/identity/identitySlice';
import { fetchCountries, fetchProfile } from '../../store/profile/profileSlice';
import { setToken } from '../../utils/tokenUtils';

export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const { status } = useAppSelector((state) => state.auth);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            if (isSignUp) {
                // Sign up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user: User = {
                    id: userCredential.user.uid,
                    email: userCredential.user.email || '',
                };
                dispatch(setUser({ ...user, needsOnboarding: true }));
                console.log('User created:', userCredential.user);
            } else {
                // Sign in
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user: User = {
                    id: userCredential.user.uid,
                    email: userCredential.user.email || '',
                };
                dispatch(setUser(user));

                dispatch(fetchProfile(user.id));
                dispatch(fetchCountries(user.id));
                setToken(user.id);

                console.log('User signed in:', userCredential.user);
            }
        } catch (error: any) {
            let errorMessage = 'Authentication failed';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use. Please sign in instead.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            }
            
            Alert.alert('Login Error', errorMessage);
            console.error('Auth error:', error);
        }
    };

    const isLoading = status === Status.Initialising;

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to</Text>
                        <Text style={styles.appTitle}>Snapbook</Text>
                        <Text style={styles.subtitle}>Discover the world, one landmark at a time</Text>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons 
                                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                size={20} 
                                color={theme.colors.textSecondary} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password Input - Only for Sign Up */}
                    {isSignUp && (
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoComplete="password"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons 
                                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                    size={20} 
                                    color={theme.colors.textSecondary} 
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleEmailLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>
                            {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    {/* Toggle Sign Up/Sign In */}
                    <TouchableOpacity 
                        style={styles.toggleButton}
                        onPress={() => setIsSignUp(!isSignUp)}
                    >
                        <Text style={styles.toggleText}>
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        minHeight: '100%',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.extraLarge,
        paddingVertical: theme.spacing.large,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.extraLarge * 2,
    },
    title: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.small,
    },
    appTitle: {
        fontSize: theme.fontSizes.extraLarge + 8,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.large,
    },
    subtitle: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.tileBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        paddingHorizontal: theme.spacing.medium,
        height: 56,
        marginBottom: theme.spacing.medium,
    },
    inputIcon: {
        marginRight: theme.spacing.small,
    },
    input: {
        flex: 1,
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primary,
        color: theme.colors.textPrimary,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.medium,
        shadowColor: theme.colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primaryBold,
        color: 'white',
    },
    toggleButton: {
        alignItems: 'center',
        marginTop: theme.spacing.large,
    },
    toggleText: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primary,
        color: theme.colors.primary,
    },
    footer: {
        alignItems: 'center',
        marginTop: theme.spacing.extraLarge,
    },
    footerText: {
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});