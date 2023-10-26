import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { NotificationComponent }  from './src/components/NotificationComponent'
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { useState } from 'react';

import { PanelComponent } from './src/components/PanelComponent'
import { SocketProvider } from './src/services/socketProvider';


export default function App() {
  
  const [selectedMenu, setSelectedMenu] = useState('DETECTIONS'); 
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
          <NotificationComponent/>
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
