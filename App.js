import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useEffect, useState } from 'react';

import { PanelComponent } from './src/components/PanelComponent'
import { SocketProvider } from './src/services/socketProvider';
import { OneSignal } from 'react-native-onesignal';
import { ENDPOINT } from './constant';

OneSignal.initialize("b62676ae-b664-47eb-90f1-02cf8ce4bce3");

export default function App() {
  const [selectedMenu, setSelectedMenu] = useState('DETECTIONS'); 

   const sendTokenToBackend = async (token) => {
    try {
    
        const response = await fetch(`${ENDPOINT}/api/save-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
        });
      
      console.log("response", response )
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Token sent successfully:', data);
    } catch (error) {
      console.error('There was a problem sending the token:', error);
    }
  }

  useEffect(() => {
    const handleOneSignal = async () => {
        OneSignal.Notifications.requestPermission(true);
        const userId = await OneSignal.User.pushSubscription.getPushSubscriptionId();
        console.log(userId)
        sendTokenToBackend(userId);

    }
    handleOneSignal()
  }, [])
  
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#3876BF',
      }}>
        <SocketProvider>
          <Header/>
          <Menu setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu}/>
          <PanelComponent selectedMenu={selectedMenu} />
          <AddButton/>
        </SocketProvider>
    </View>
  );
}

const AddButton = () => {
  return(
    <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add New Suspect')}>
        <Text style={styles.addButtonText}>ADD NEW SUSPECT</Text>
    </TouchableOpacity>
  );
}

const Menu = ({ setSelectedMenu, selectedMenu }) => {
  return(
    <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItemContainer} onPress={() => setSelectedMenu('ALARMS')}>
          <Text style={[styles.menuItem, selectedMenu === 'ALARMS' && styles.selectedMenu]}>ALARMS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItemContainer} onPress={() => setSelectedMenu('DETECTIONS')}>
          <Text style={[styles.menuItem, selectedMenu === 'DETECTIONS' && styles.selectedMenu]}>DETECTIONS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItemContainer} onPress={() => setSelectedMenu('WATCH LIST')}>
          <Text style={[styles.menuItem, selectedMenu === 'WATCH LIST' && styles.selectedMenu]}>WATCH LIST</Text>
        </TouchableOpacity>
    </View>
  );
  
}

const Header = () => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.iconContainer}>
      <FontAwesome name="bars" size={24} color="white" />
    </TouchableOpacity>
    <View style={styles.logoContainer}>
      <Image
        source={require('./assets/white_logo.png')}
        style={styles.logo}
      />
    </View>
    <TouchableOpacity style={styles.iconContainer}>
      <FontAwesome name="search" size={24} color="white" /> 
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  addButton: {
    width: '100%',
    height: '10%',
    backgroundColor: '#67a3f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    backgroundColor: '#192655',
    paddingBottom: 10,
    paddingTop: 20,
    width: '100%', 
    height: '12%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#192655',
    width: '55%', 
    height: '50%',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  menuContainer: {
    backgroundColor: '#192655',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,  
    paddingTop: 10,  
  },
  menuItemContainer: {
    width:"33%",
    alignItems: "center"
  },
  menuItem: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,  
  },
  selectedMenu: {
    borderBottomWidth: 5,
    color: '#F3F0CA',
    
  }

});
