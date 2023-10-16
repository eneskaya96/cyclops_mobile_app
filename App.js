import { useState, useEffect, useRef } from 'react';
import { Text, SafeAreaView, View, Button } from 'react-native';
import { registerForPushNotificationsAsync } from './notificationService';
import * as Notifications from 'expo-notifications';
import { sendTokenToBackend } from './notificationService';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
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
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
    </SafeAreaView>
  );
}
