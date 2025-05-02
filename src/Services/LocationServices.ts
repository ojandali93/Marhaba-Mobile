import {Platform, PermissionsAndroid} from 'react-native';
import {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LocationType = {latitude: number; longitude: number};

export default function useLocation() {
  const [region, setRegion] = useState<LocationType>(); // null location
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }
      Geolocation.getCurrentPosition(
        position => {
          getLocation(position);
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
        },
        error => console.log(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return {region, loading};
}

export const getLocation = async (position: LocationType) => {
  const latitude = await AsyncStorage.setItem('user_lat', position.latitude.toString());
  const longitude = await AsyncStorage.setItem('user_lng', position.longitude.toString());
  return {latitude, longitude};
};
