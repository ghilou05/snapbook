import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { useAppSelector } from '../store/hooks';

export type AnonymousStackParamList = {
  Login: undefined;
  Onboarding: undefined;
};

const Stack = createStackNavigator<AnonymousStackParamList>();

export default function AnonymousRoutes() {
  const needsOnboarding = useAppSelector((state) => state.auth.needsOnboarding);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {needsOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}