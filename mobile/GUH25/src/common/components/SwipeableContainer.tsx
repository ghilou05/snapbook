import React, { useState, useRef, Profiler, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import CameraScreen from '../../screens/camera/CameraScreen';

export default function SwipeableContainer() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const pages = [
    { name: 'Profile', component: ProfileScreen, icon: 'person' },
    { name: "Camera", component: CameraScreen, icon: 'camera' },
  ];

  const navigateToPage = (pageIndex: number) => {
    pagerRef.current?.setPage(pageIndex);
    setCurrentPage(pageIndex);
  };

  const renderTabIndicator = () => (
    <View style={styles.navigationContainer}>
      
      {/* Tab Dots */}
      <View style={styles.tabIndicator}>
        {pages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabDot,
              currentPage === index && styles.tabDotActive
            ]}
            onPress={() => navigateToPage(index)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={pages[index].icon as any}
              size={currentPage === index ? 22 : 20}
              color={currentPage === index ? '#fff' : '#9CA3AF'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {/* Swipeable Pages */}
          <PagerView
            ref={pagerRef}
            style={styles.pager}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {pages.map((page, index) => (
              <View key={index} style={styles.page}>
                <page.component />
              </View>
            ))}
          </PagerView>

          {/* Tab Indicator */}
          {renderTabIndicator()}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Navigation Container
  navigationContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  
  // Page Title
  pageTitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamilies.primaryBold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 30,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },

  // Tab Indicator
  tabIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120, // Reduced from 180 since we now have only 2 tabs
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: 'transparent',
  },
  tabDotActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{ scale: 1.05 }],
  },
});