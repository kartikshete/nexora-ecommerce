import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('nexora_token');
    if (token) {
      // Verify token and fetch user data
      axios
        .get('/api/auth/me')
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          // Token invalid/expired
          localStorage.removeItem('nexora_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (signupData) => {
    const res = await axios.post('/api/auth/signup', signupData);
    const { token, user: newUser } = res.data;
    localStorage.setItem('nexora_token', token);
    setUser(newUser);
    return newUser;
  };

  const login = async (loginData) => {
    const res = await axios.post('/api/auth/login', loginData);
    const { token, user: loggedUser } = res.data;
    localStorage.setItem('nexora_token', token);
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = () => {
    localStorage.removeItem('nexora_token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, signup, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
