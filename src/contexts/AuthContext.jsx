import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const AuthContext = createContext(null);
const isDev = import.meta.env.DEV;

export function AuthProvider({ children }) {
  const { 
    user: auth0User, 
    isAuthenticated, 
    isLoading: auth0Loading, 
    loginWithRedirect, 
    logout, 
    getAccessTokenSilently,
    error: auth0Error
  } = useAuth0();
  
  const storeUser = useMutation(api.auth.storeUser);
  
  const convexUser = useQuery(
    api.auth.getUser, 
    isAuthenticated && auth0User?.sub ? { auth0Id: auth0User.sub } : 'skip'
  );

  const [isAdmin, setIsAdmin] = useState(false);

  // Only log in development
  useEffect(() => {
    if (auth0Error && isDev) {
      console.error('Auth0 error:', auth0Error.message);
    }
  }, [auth0Error]);

  useEffect(() => {
    if (isAuthenticated && auth0User?.sub) {
      // if (isDev) console.log('Storing user:', auth0User.sub);
      
      storeUser({ 
        auth0Id: auth0User.sub, 
        email: auth0User.email || '', 
        name: auth0User.name || auth0User.email || 'Anonymous', 
        picture: auth0User.picture 
      })
      .then((id) => {
        // if (isDev) console.log('User stored:', id);
      })
      .catch((err) => {
        if (isDev) console.error('Store failed:', err);
      });
    }
  }, [isAuthenticated, auth0User?.sub]);

  useEffect(() => {
    if (convexUser) {
      setIsAdmin(convexUser.role === 'admin');
    }
  }, [convexUser]);

  const login = useCallback(() => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  }, [loginWithRedirect]);
  
  const logoutUser = useCallback(() => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      user: convexUser || null,
      auth0User: auth0User || null,
      isAuthenticated,
      isLoading: auth0Loading,
      isAdmin,
      login,
      logout: logoutUser,
      getAccessTokenSilently
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};