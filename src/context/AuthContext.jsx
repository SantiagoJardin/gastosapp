import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const [isSetup, setIsSetup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await fetch('/api/auth/setup-status');
        if (res.ok) {
          const data = await res.json();
          setIsSetup(data.isSetup);
        } else {
          setIsSetup(true); // fallback to stop blocking if error
        }
      } catch (err) {
        console.error('Failed to check setup status', err);
        setIsSetup(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkSetup();
  }, []);

  const login = async (user, pass) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login fallido');
    }

    const data = await res.json();
    setToken(data.token);
    setUsername(data.username);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
  };

  const setup = async (user, pass) => {
    const res = await fetch('/api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Configuración fallida');
    }

    setIsSetup(true);
    await login(user, pass);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{
      token,
      username,
      isAuthenticated: !!token,
      isSetup,
      isLoading,
      login,
      setup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
