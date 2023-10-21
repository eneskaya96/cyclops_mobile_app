import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useSocket } from '../services/socketProvider'; 
import axios from 'axios';
import { ENDPOINT } from '../../constant';


export const PanelComponent = ({selectedMenu}) => {
  const socket = useSocket();
  const [images, setImages] = useState([]);

  

  useEffect(() => {
    axios.get(`${ENDPOINT}/list_images`)
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the images", error);
      });
  }, []);

  useEffect(() => {
    if (socket) {
        socket.on('new_detection', (newImages) => {
            console.log('New detection', newImages.data);
            setImages((prevImages) => [ ...newImages.data, ...prevImages]);
        });
        return () => socket.off("new_detection");
    }
  }, [socket]);


  if(selectedMenu !== 'DETECTIONS'){
    return (
        <View style={styles.emptyContainer}>
        </View>
    );
  }
  return (
    <View style={styles.container}>
        <FlatList
            data={images}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => console.log("PRESS")}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: `${ENDPOINT}/image/${item[0]}` }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>Maximillian Max</Text>
                        <Text style={styles.groupText}>Default Camera Group</Text>
                        { Math.random() > 0.5 && <Text style={styles.terroristText}>Terrorist</Text>}
                        <Text style={styles.dateText}>22 May 2018 22:47:12</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
        />
    </View>
   );
};

const styles = StyleSheet.create({
    
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
  terroristText: {
    marginTop: 5,
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'red',
    paddingHorizontal: 5,
    borderRadius: 5,
    width:'100%'
}
});

