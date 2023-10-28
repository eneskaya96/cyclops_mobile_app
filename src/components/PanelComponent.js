import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, RefreshControl, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useSocket } from '../services/socketProvider'; 
import axios from 'axios';
import { ENDPOINT } from '../../constant';


export const PanelComponent = ({selectedMenu}) => {
  const socket = useSocket(); // it will be used when socket bug fixed
  const [gifModalVisible, setGifModalVisible] = useState(false);
  const [currentGifUrl, setCurrentGifUrl] = useState(null); 
  const [detectedPersons, setDetectedPersons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingGif, setLoadingGif] = useState(true);

  const showGif = (item) => {
    setCurrentGifUrl(`${ENDPOINT}/image/${item.url}.gif`); 
    setGifModalVisible(true);
  } 

  const fetchDetectedImages = () => {
    axios.get(`${ENDPOINT}/list_detected_images`)
      .then(response => {
        const sortedData = response.data.sort((a, b) => {
          const dateA = new Date(a.detection_date);
          const dateB = new Date(b.detection_date);
          return dateB - dateA; 
        });
        setDetectedPersons(sortedData);
        setRefreshing(false);
      })
      .catch(error => {
        console.error("There was an error fetching the images", error);
        setRefreshing(false); 
      });
  };

  const onRefresh = useCallback(() => {
    console.log("resfres")
    setRefreshing(true);
    fetchDetectedImages();
  }, []);
  
  useEffect(() => {
    fetchDetectedImages(); 

    const intervalId = setInterval(() => {
      fetchDetectedImages(); 
    }, 1000); 

    return () => clearInterval(intervalId);
  }, []);

  // it will be used when socket bug fixed
  /*
  useEffect(() => {
    if (socket) {
        socket.on('new_detection', (newImages) => {
          console.log("new_detection")
          setDetectedPersons((prevImages) => [ ...newImages.data, ...prevImages]);
        });
        return () => socket.off("new_detection");
    }
  }, [socket]);
  */

  const listItem = (item) => {
    return (
      <TouchableOpacity onPress={() => showGif(item)}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: `${ENDPOINT}/image/${item.url}.png` }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={styles.groupText}>Default Camera Group</Text>
                {Boolean(item.thread) && <Text style={styles.suspectText}>Suspect</Text>}
                <Text style={styles.dateText}>{item.detection_date}</Text>
            </View>
        </View>
    </TouchableOpacity> 
    ); 
  }

  const filteredViews = (filter) => {
    return (
      <View style={styles.container}>
        <FlatList
            data={detectedPersons}
            renderItem={({ item }) => (
              filter == 'ALARMS' ?  item.thread && listItem(item) : listItem(item)
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            keyExtractor={(item) => item.id}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={gifModalVisible}
          onRequestClose={() => {
            setGifModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                source={{ uri: currentGifUrl }}
                style={styles.gifImage}
                onLoadStart={() => setLoadingGif(true)}
                onLoad={() => setLoadingGif(false)} 
                onError={(error) => {
                  console.error('Image loading error: ', error);
                  setLoadingGif(true); 
                }}
              />
              {loadingGif && (
                <ActivityIndicator size="large" color="#999999" style={styles.activityIndicator}/> 
              ) }
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setGifModalVisible(false)}
              >
                <Text style={styles.textStyle}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if(selectedMenu == 'DETECTIONS'){
    return filteredViews();
  }
  else if(selectedMenu == 'ALARMS') {
    return filteredViews('ALARMS');
  }
  else {
    return (
      <View style={styles.emptyContainer}>
      </View>
    );
  }
};

const styles = StyleSheet.create({
    
  activityIndicator: {
    position: 'absolute',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#194178',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E1AA74',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 3,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupText: {
    marginTop: 5,
    fontSize: 15,
    color: '#a5a5a5',
  },
  dateText: {
    marginTop: 5,
    fontSize: 13,
    color: '#c5c5c5',
  },
  suspectText: {
    marginTop: 5,
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'red',
    paddingHorizontal: 5,
    borderRadius: 5,
    width:'100%'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#194178",
    padding: 15,
    alignItems: "center",
    shadowColor: "black",
    width: '80%',
    height: '60%',
    borderWidth: 3, 
    borderColor: '#E1AA74',
    borderColor: 'black',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  gifImage: {
    width: '80%',  
    height: '85%',
    marginBottom: 15,
  },
});