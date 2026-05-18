import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import ProfileCard from '../../common/components/profile/ProfileCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
<<<<<<< HEAD
import { fetchCountries, fetchProfile } from '../../store/profile/profileSlice';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with margins
=======
>>>>>>> main

export default function ProfileScreen() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
<<<<<<< HEAD
    const profile = useAppSelector((state) => state.profile);

    useEffect(() => {
        dispatch(fetchProfile(user.id));
        dispatch(fetchCountries(user.id));
    }, [dispatch, user.id]);
    
    const renderPhotoCard = (imageUrl: string, index: number) => (
        <TouchableOpacity
            key={index}
            style={styles.photoCard}
            activeOpacity={0.8}
        >
            <View style={styles.photoContainer}>
                <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.photoImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.photoInfo}>
                <Text style={styles.photoTitle}>
                    {profile.countries[index]}
                </Text>
            </View>
        </TouchableOpacity>
    );
=======
>>>>>>> main

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Photos Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
                Start capturing cultural moments around you!
            </Text>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            {/* Profile Card */}
            <ProfileCard />            

<<<<<<< HEAD
            {/* Photo Grid */}
            <View style={styles.photosSection}>
                <Text style={styles.sectionTitle}>Your Cultural Photos</Text>

                <View style={styles.photosGrid}>
                    {profile.images.length > 0 
                        ? profile.images.map(renderPhotoCard)
                        : renderEmptyState()
                    }
                </View>
            </View>

=======
            {/* Instructions Section */}
            <View style={styles.instructionsSection}>
                <View style={styles.instructionItem}>
                    <View style={styles.instructionIcon}>
                        <Ionicons name="camera" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.instructionText}>
                        <Text style={{ fontFamily: theme.fontFamilies.primaryBold }}>Swipe left</Text> to open the camera
                    </Text>
                </View>
            </View>

            {/* Promo Section */}
            <View style={styles.promoSection}>
                <Text style={styles.promoTitle}>Snapbook Web</Text>
                <Text style={styles.promoText}>
                    Dive into an interactive experience with our immersive 3D globe and interactive maps on Snapbook Web.
                </Text>
                
                <View style={styles.promoFeatures}>
                    <View style={styles.featureItem}>
                        <Ionicons name="globe" size={16} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Interactive 3D Globe</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Ionicons name="map" size={16} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Detailed World Maps</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Ionicons name="location" size={16} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Landmark Discovery</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Ionicons name="images" size={16} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Visual Journey Timeline</Text>
                    </View>
                </View>
            </View>

>>>>>>> main
            {/* Spacer for navigation bar */}
            <View style={styles.spacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    welcomeSection: {
        alignItems: 'center',
        marginHorizontal: theme.spacing.large,
        marginTop: theme.spacing.extraLarge,
        marginBottom: theme.spacing.large,
    },
    welcomeTitle: {
        fontSize: theme.fontSizes.extraLarge + 4,
        fontFamily: theme.fontFamilies.primaryBold,
<<<<<<< HEAD
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.medium,
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    // Photo Cards
    photoCard: {
        width: cardWidth,
        backgroundColor: theme.colors.tileBackground,
        borderRadius: 16,
        padding: theme.spacing.medium,
        marginBottom: theme.spacing.medium,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.small,
    },
    photoImage: {
        width: cardWidth - (theme.spacing.medium * 2),
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    photoInfo: {
        alignItems: 'center',
    },
    photoTitle: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.textPrimary,
        marginBottom: 4,
=======
        color: theme.colors.primary,
>>>>>>> main
        textAlign: 'center',
        marginBottom: theme.spacing.medium,
    },
<<<<<<< HEAD
    photoLocation: {
        fontSize: theme.fontSizes.small,
=======
    welcomeSubtitle: {
        fontSize: theme.fontSizes.medium,
>>>>>>> main
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    instructionsSection: {
        backgroundColor: theme.colors.tileBackground,
        borderRadius: 16,
        padding: theme.spacing.large,
        marginHorizontal: theme.spacing.large,
        
        marginVertical: theme.spacing.large,
        borderWidth: 1,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    instructionIcon: {
        marginRight: theme.spacing.medium,
        width: 40,
        alignItems: 'center',
    },
    instructionText: {
        flex: 1,
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.primary,
        color: theme.colors.textPrimary,
        lineHeight: 22,
    },
    promoSection: {
        backgroundColor: theme.colors.tileBackground,
        borderRadius: 16,
        padding: theme.spacing.large,
        marginHorizontal: theme.spacing.large,
        marginBottom: theme.spacing.large,
        borderWidth: 2,
        borderColor: `${theme.colors.primary}30`,
    },
    promoTitle: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.medium,
    },
    promoText: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: theme.spacing.large,
    },
    promoFeatures: {
        alignItems: 'center',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.small,
    },
    featureText: {
        fontSize: theme.fontSizes.small + 2,
        fontFamily: theme.fontFamilies.primary,
        color: theme.colors.primary,
        marginLeft: theme.spacing.small,
    },
    spacer: {
        height: 100, // Space for navigation bar
    },

    // Empty State
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.extraLarge * 2,
    },
    emptyStateTitle: {
        fontSize: theme.fontSizes.large,
        fontFamily: theme.fontFamilies.primaryBold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.small,
        textAlign: 'center',
    },
    emptyStateSubtitle: {
        fontSize: theme.fontSizes.medium,
        fontFamily: theme.fontFamilies.secondary,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        maxWidth: 200,
        lineHeight: 22,
    },

    // Spacer
    spacer: {
        height: 120,
    },
});