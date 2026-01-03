import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const login = (token, userData) => { 
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    setVideos([]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, videos, setVideos }}>
      {children}
    </AuthContext.Provider>
  );
}
