// App.tsx or initNotifications.ts
import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const initNotifications = () => {
  useEffect(() => {
    // Request permissions
    PushNotificationIOS.requestPermissions().then((data) => {
      console.log('Push Notification Permissions:', data);
    });

    // Register for remote notifications
    PushNotificationIOS.addEventListener('register', (token) => {
      console.log('Device Token Received:', token);

      // Send token to your Node.js server
      fetch('https://your-server.com/api/store-device-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    });

    PushNotificationIOS.addEventListener('registrationError', (err) => {
      console.error('APNs registration error:', err);
    });

    // Handle foreground notifications
    PushNotificationIOS.addEventListener('notification', (notification) => {
      const data = notification.getData();
      Alert.alert(notification.getTitle(), notification.getMessage());
    });

    PushNotificationIOS.addEventListener('localNotification', (notification) => {
      console.log('Local Notification:', notification);
    });

    // Register with APNs
    PushNotificationIOS.registerForRemoteNotifications();

    return () => {
      PushNotificationIOS.removeAllDeliveredNotifications();
    };
  }, []);
};

export default initNotifications;
