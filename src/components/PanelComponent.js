import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { useSocket } from '../services/socketProvider'; 
import axios from 'axios';
import { ENDPOINT } from '../../constant';


export const PanelComponent = ({selectedMenu}) => {
  const socket = useSocket();
  const [detectedPersons, setDetectedPersons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Yenileme işlemi sırasında çalışacak fonksiyon
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios.get(`${ENDPOINT}/list_detected_images`)
      .then(response => {
        const sortedData = response.data.sort((a, b) => {
          // Tarih stringlerini Date objelerine dönüştür
          const dateA = new Date(a.detection_date);
          const dateB = new Date(b.detection_date);

          // Tarihleri karşılaştır ve sıralama yap
          return dateB - dateA; // en yeni tarihlerden en eski tarihler sıralaması için
          // eğer en eski tarihlerden en yeni tarihler sıralamasını istiyorsanız "dateA - dateB" kullanın.
        });
        setDetectedPersons(sortedData); // Yeni verilerle listeyi güncelle
        setRefreshing(false); // Yenileme işlemini durdur
      })
      .catch(error => {
        console.error("There was an error fetching the images", error);
        setRefreshing(false); // Yenileme işlemini durdur
      });
  }, []);
  

  useEffect(() => {
    axios.get(`${ENDPOINT}/list_detected_images`)
      .then(response => {
        const sortedData = response.data.sort((a, b) => {
          // Tarih stringlerini Date objelerine dönüştür
          const dateA = new Date(a.detection_date);
          const dateB = new Date(b.detection_date);

          // Tarihleri karşılaştır ve sıralama yap
          return dateB - dateA; // en yeni tarihlerden en eski tarihler sıralaması için
          // eğer en eski tarihlerden en yeni tarihler sıralamasını istiyorsanız "dateA - dateB" kullanın.
        });
        setDetectedPersons(sortedData);
      })
      .catch(error => {
        console.error("There was an error fetching the images", error);
      });
  }, []);

  useEffect(() => {
    if (socket) {
        socket.on('new_detection', (newImages) => {
          console.log("new_detection")
          setDetectedPersons((prevImages) => [ ...newImages.data, ...prevImages]);
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
            data={detectedPersons}
            renderItem={({ item }) => (
            <TouchableOpacity onPress={() => console.log("PRESS")}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: `${ENDPOINT}/image/${item.url}.png` }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>{item.name}</Text>
                        <Text style={styles.groupText}>Default Camera Group</Text>
                        {Boolean(item.thread) && <Text style={styles.terroristText}>Suspect</Text>}
                        <Text style={styles.dateText}>{item.detection_date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
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

