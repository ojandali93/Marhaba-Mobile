import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useSessionCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkSessionWithServer = async () => {
      const token = await AsyncStorage.getItem('access_token'); // 👈 No supabase client needed

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch('https://marhaba-server.onrender.com/api/auth/session', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };

    checkSessionWithServer();
  }, []);

  return isAuthenticated;
};
