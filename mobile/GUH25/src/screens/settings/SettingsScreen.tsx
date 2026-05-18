import { View, Text, StyleSheet } from "react-native";
import { theme } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.large,
  },
  title: {
    fontSize: theme.fontSizes.large,
    fontWeight: theme.fontWeights.semiBold,
    fontFamily: theme.fontFamilies.primaryBold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: theme.fontWeights.normal,
    fontFamily: theme.fontFamilies.secondary,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default function SettingsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Adjust your preferences here.</Text>
        </View>
    );
}