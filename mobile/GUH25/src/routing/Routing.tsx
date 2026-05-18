import React from 'react';
import { useAppSelector } from '../store/hooks';
import AnonymousRoutes from './AnonymousRoutes';
import AuthorizedRoutes from './AuthorizedRoutes';

export default function Routing() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const needsOnboarding = useAppSelector((state) => state.auth.needsOnboarding);

  // If user is authenticated but needs onboarding, show anonymous routes (with onboarding screen)
  // Otherwise show authorized routes if authenticated, or anonymous routes if not
  return isAuthenticated && !needsOnboarding ? <AuthorizedRoutes /> : <AnonymousRoutes />;
}