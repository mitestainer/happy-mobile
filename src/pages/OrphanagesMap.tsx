import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps'
import { Feather } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { RectButton } from 'react-native-gesture-handler';

import mapMarker from '../images/map-marker.png'

interface Orphanage {
  id: number
  name: string
  latitude: number
  longitude: number
}

export default () => {
    const navigation = useNavigation()

    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useFocusEffect(() => {
      api.get('/orphanages').then(res => {
        setOrphanages(res.data)
      })
    })

    const handleNavigateToOrphanageDetails = (id: number) => {
        navigation.navigate('OrphanageDetails', {id})
    }

    const handleNavigateToCreateOrphanage = () => {
      navigation.navigate('SelectMapPosition')
    }

    return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={{
          latitude: -23.5515193939209, 
          longitude: -46.633140563964844,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008
        }}
        provider={PROVIDER_GOOGLE}
      >
        {orphanages.map(item => {
          return (
            <Marker key={item.id} icon={mapMarker} coordinate={{ latitude: item.latitude, longitude: item.longitude }} calloutAnchor={{x:2.7 , y:0.8}}>
              <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(item.id)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{item.name}</Text>
                </View>
              </Callout>
            </Marker>
          )
        })}
      </MapView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
          <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
            <Feather name="plus" size={20} color="#fff" />
          </RectButton>
      </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255,  0.8)',
      borderRadius: 16,
      justifyContent: 'center',
      elevation: 3
    },
  
    calloutText: {
      color: '#0089a5',
      fontSize: 14,
      fontFamily: 'Nunito_700Bold'
    },
  
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
      backgroundColor: '#fff',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      elevation: 3
    },
  
    footerText: {
      color: '#8fa7b3',
      fontFamily: 'Nunito_700Bold'
    },
  
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    }
});