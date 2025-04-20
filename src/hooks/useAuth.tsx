import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User, LoginCredentials } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'hrms_token';
const SESSION_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Simulated login API call
  const login = async (credentials: LoginCredentials) => {
    try {
      // In a real app, this would be an API call
      if (credentials.email === 'hr@example.com' && credentials.password === 'password') {
        // Create a mock token with 2 hour expiry
        const now = Date.now();
        const expiresAt = now + SESSION_EXPIRY;
        
        // Mock user data
        const user: User = {
          id: '1',
          username: 'hrmanager',
          email: credentials.email,
          role: 'HR Manager',
          firstName: 'John',
          lastName: 'Doe',
        };
        
        // Create a mock JWT with user info and expiry
        const token = `mockjwt.${btoa(JSON.stringify({ user, exp: expiresAt }))}.signature`;
        
        // Save token to localStorage
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem('token_created_at', now.toString());
        
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

        // Set up auto-logout
        setupAutoLogout(expiresAt);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: 'Invalid email or password',
      });
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token_created_at');
    clearTimeout(window.autoLogoutTimer);
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  const setupAutoLogout = (expiryTime: number) => {
    const timeLeft = expiryTime - Date.now();
    if (timeLeft <= 0) {
      logout();
      return;
    }
    
    // Clear any existing timer
    if (window.autoLogoutTimer) {
      clearTimeout(window.autoLogoutTimer);
    }
    
    // Set up the auto-logout timer
    window.autoLogoutTimer = setTimeout(() => {
      logout();
      alert('Your session has expired. Please log in again.');
    }, timeLeft);
  };

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const tokenCreatedAt = localStorage.getItem('token_created_at');
      
      if (!token || !tokenCreatedAt) {
        logout();
        return;
      }
      
      // Check if token is expired (2 hour session)
      const createdAt = parseInt(tokenCreatedAt, 10);
      const expiresAt = createdAt + SESSION_EXPIRY;
      
      if (Date.now() > expiresAt) {
        logout();
        return;
      }
      
      // In a real app, you would decode JWT properly
      try {
        // Our mock token format is "mockjwt.{base64_payload}.signature"
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        
        setAuthState({
          user: payload.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
        
        // Set up auto-logout for remaining time
        setupAutoLogout(expiresAt);
      } catch (e) {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Type assertion to avoid undefined check
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Extend Window interface to include the auto-logout timer
declare global {
  interface Window {
    autoLogoutTimer: ReturnType<typeof setTimeout>;
  }
}