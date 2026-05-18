import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import ProfileAvatar from "./ProfileAvatar";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/identity/identitySlice";
import { theme } from "../../../theme";
import { clearProfile } from "../../../store/profile/profileSlice";
import { removeToken } from "../../../utils/tokenUtils";

const styles = StyleSheet.create({
// Profile Card
    profileCard: {
        backgroundColor: theme.colors.tileBackground,
        marginHorizontal: theme.spacing.large,
        marginTop: theme.spacing.large,
        borderRadius: 20,
        padding: theme.spacing.large,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.large,
    },

    // Profile Info
    profileInfo: {
        flex: 1,
        marginLeft: theme.spacing.medium,
        marginTop: 32,
    },
    profileName: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    statsContainer: {
        gap: 6,
    },
    statText: {
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
    },

    // Logout Button
    logoutButton: {
        padding: 8,
        borderRadius: 8,
        marginLeft: theme.spacing.small,
    },

    // Progress Section
    progressSection: {
        marginTop: theme.spacing.small,
    },
    progressLabel: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
    },
    progressText: {
        fontSize: theme.fontSizes.small,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
    },
});

export default function ProfileCard() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const profile = useAppSelector((state) => state.profile);

    const visitedCountries = profile.countries.length;
    const totalCountries = 195;

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => logoutUser(),
                },
            ]
        );
    };

    const logoutUser = () => {
        dispatch(logout());
        dispatch(clearProfile());
        removeToken();
    }
    return (
        <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
                {/* Profile Image */}
                <ProfileAvatar width={100} height={100} />

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{profile.username || 'Travel Explorer'}</Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>Travel Progress</Text>
                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
                            { width: `${(visitedCountries / totalCountries) * 100}%` }
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {visitedCountries} of {totalCountries} countries discovered
                </Text>
            </View>
        </View>
    )
}