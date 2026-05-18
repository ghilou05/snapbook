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
import { setOnboardingComplete } from '../../store/identity/identitySlice';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ProfileData, setProfile } from '../../apiServices/profile/ProfileApiService';
import { fetchCountries, fetchProfile } from '../../store/profile/profileSlice';
import { setToken } from '../../utils/tokenUtils';

export default function OnboardingScreen() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleComplete = async () => {
        if (!displayName.trim()) {
            Alert.alert('Error', 'Please enter a display name');
            return;
        }

        setIsLoading(true);
        try {
            // Mark onboarding as complete
            dispatch(setOnboardingComplete());

            const userProfile: ProfileData = {
                username: displayName.trim(),
                email: user.email,
                createdAt: new Date().toISOString(),
            };

            await setProfile(user.id, userProfile);

            dispatch(fetchProfile(user.id));
            dispatch(fetchCountries(user.id));
            setToken(user.id);
            
            Alert.alert('Success', 'Profile created successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to create profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Ionicons name="person-circle-outline" size={80} color={theme.colors.primary} />
                        <Text style={styles.title}>Create Your Profile</Text>
                        <Text style={styles.subtitle}>How would you like to be called?</Text>
                    </View>

                    {/* Display Name Input */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Display Name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={displayName}
                            onChangeText={setDisplayName}
                            autoCapitalize="words"
                            autoFocus
                        />
                    </View>

                    {/* Complete Button */}
                    <TouchableOpacity
                        style={[styles.completeButton, isLoading && styles.completeButtonDisabled]}
                        onPress={handleComplete}
                        disabled={isLoading}
                    >
                        <Text style={styles.completeButtonText}>
                            {isLoading ? 'Creating profile...' : 'Complete Setup'}
                        </Text>
                    </TouchableOpacity>

                    {/* Info Text */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            This name will be visible to other users when you share your landmark discoveries
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
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.extraLarge,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.extraLarge * 2,
    },
    title: {
        fontSize: theme.fontSizes.extraLarge,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.large,
        marginBottom: theme.spacing.small,
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
        backgroundColor: 'white',
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
    completeButton: {
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
    completeButtonDisabled: {
        opacity: 0.6,
    },
    completeButtonText: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primaryBold,
        color: 'white',
    },
    infoContainer: {
        marginTop: theme.spacing.extraLarge,
        paddingHorizontal: theme.spacing.medium,
    },
    infoText: {
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
