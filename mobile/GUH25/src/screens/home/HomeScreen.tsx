import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    // Placeholder images for the carousel (you'll replace these with actual web app screenshots)
    const webAppImages = [
        { id: 1, title: 'Cultural Discovery Map', source: require('../../../assets/icon.png') },
        { id: 2, title: 'Local Experiences', source: require('../../../assets/icon.png') },
        { id: 3, title: 'Your Cultural Journey', source: require('../../../assets/icon.png') },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Snapbook</Text>
                <Text style={styles.heroSubtitle}>
                    Capture culture, one moment at a time
                </Text>
                <Text style={styles.heroDescription}>
                    Discover and document the unique culture around you as you explore new countries and cities.
                </Text>
            </View>

            {/* Tips Cards */}
            <View style={styles.tipsSection}>
                <Text style={styles.sectionTitle}>Get Started</Text>
                
                <View style={styles.tipCard}>
                    <View style={styles.tipIconContainer}>
                        <Ionicons name="person-circle" size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>View Your Journey</Text>
                        <Text style={styles.tipDescription}>
                            Swipe right to see your cultural discoveries and travel progress
                        </Text>
                    </View>
                    <View style={styles.tipArrow}>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </View>
                </View>

                <View style={styles.tipCard}>
                    <View style={styles.tipIconContainer}>
                        <Ionicons name="camera" size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>Capture Culture</Text>
                        <Text style={styles.tipDescription}>
                            Swipe left to start documenting local culture and authentic moments
                        </Text>
                    </View>
                    <View style={styles.tipArrow}>
                        <Ionicons name="chevron-back" size={20} color={theme.colors.textSecondary} />
                    </View>
                </View>
            </View>

            {/* Web App Promo Section */}
            <View style={styles.promoSection}>
                <Text style={styles.sectionTitle}>Experience Snapbook Web</Text>
                <Text style={styles.promoDescription}>
                    Take your journey to the next level with our immersive web experience
                </Text>
                
                {/* Image Carousel */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.carousel}
                    contentContainerStyle={styles.carouselContent}
                >
                    {webAppImages.map((image) => (
                        <View key={image.id} style={styles.carouselItem}>
                            <Image source={image.source} style={styles.carouselImage} />
                            <Text style={styles.carouselTitle}>{image.title}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Features List */}
                <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                        <Ionicons name="globe" size={20} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Interactive Cultural Map</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Ionicons name="map" size={20} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Discover Local Culture</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Ionicons name="analytics" size={20} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Cultural Journey Insights</Text>
                    </View>
                    
                    <View style={styles.featureItem}>
                        <Ionicons name="images" size={20} color={theme.colors.primary} />
                        <Text style={styles.featureText}>Visual Cultural Timeline</Text>
                    </View>
                </View>
            </View>

            {/* CTA Section */}
            <View style={styles.ctaSection}>
                <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>Visit Snapbook Web</Text>
                    <Ionicons name="open-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Spacer for navigation */}
            <View style={styles.spacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.extraLarge * 1.5,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.fontSizes.extraLarge + 8,
    fontFamily: theme.fontFamilies.primaryBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.fontSizes.large,
    fontFamily: theme.fontFamilies.primary,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.secondary,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  // Tips Section
  tipsSection: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.large,
    fontFamily: theme.fontFamilies.primaryBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.large,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tileBackground,
    borderRadius: 16,
    padding: theme.spacing.large,
    marginBottom: theme.spacing.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.medium,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: theme.fontSizes.medium + 2,
    fontFamily: theme.fontFamilies.primaryBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.small,
  },
  tipDescription: {
    fontSize: theme.fontSizes.small + 2,
    fontFamily: theme.fontFamilies.secondary,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  tipArrow: {
    marginLeft: theme.spacing.small,
  },

  // Promo Section
  promoSection: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.large,
  },
  promoDescription: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.secondary,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
    lineHeight: 22,
  },

  // Carousel
  carousel: {
    marginBottom: theme.spacing.large,
  },
  carouselContent: {
    paddingHorizontal: theme.spacing.small,
  },
  carouselItem: {
    width: 220,
    marginHorizontal: theme.spacing.small,
    alignItems: 'center',
  },
  carouselImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: theme.spacing.medium,
    backgroundColor: '#f0f0f0',
  },
  carouselTitle: {
    fontSize: theme.fontSizes.small + 2,
    fontFamily: theme.fontFamilies.primary,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },

  // Features List
  featuresList: {
    backgroundColor: theme.colors.tileBackground,
    borderRadius: 16,
    padding: theme.spacing.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  featureText: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.primary,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.medium,
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.large,
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.large + theme.spacing.medium,
    paddingVertical: theme.spacing.medium + theme.spacing.small,
    borderRadius: 25,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.primaryBold,
    color: 'white',
    marginRight: theme.spacing.small,
  },

  // Spacer
  spacer: {
    height: 120,
  },
});