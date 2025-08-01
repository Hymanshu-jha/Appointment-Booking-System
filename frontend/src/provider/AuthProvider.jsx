import React, { useState, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await fetch(`${apiUrl}/oauth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          console.log("user is", data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      }
    };

    getMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
