import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import { theme } from '../../theme';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  visible: boolean;
  message?: string;
}

export default function LoadingScreen({ visible, message = "Processing..." }: LoadingScreenProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.primary}
            style={styles.spinner}
          />
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subMessage}>Please wait...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.tileBackground,
    padding: theme.spacing.extraLarge,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  spinner: {
    marginBottom: theme.spacing.medium,
  },
  message: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fontFamilies.primaryBold,
    textAlign: 'center',
    marginBottom: theme.spacing.small,
  },
  subMessage: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.small,
    fontFamily: theme.fontFamilies.primary,
    textAlign: 'center',
  },
});