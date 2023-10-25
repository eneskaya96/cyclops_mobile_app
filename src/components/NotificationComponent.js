import { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { sendTokenToBackend, registerForPushNotificationsAsync } from '../services/notificationService';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function NotificationComponent() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    console.log("useEffect")
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      sendTokenToBackend(token); 
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("A")
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("A")
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  console.log(expoPushToken)
  return (
    <View></View>
  );
}
