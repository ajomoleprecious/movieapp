import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import * as Location from 'expo-location';
import LoadingSpinner from '@/components/Loading';
import { DrawerActions } from '@react-navigation/native';
import { Bars3CenterLeftIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import * as Linking from 'expo-linking';
import { Cinema } from '@/types';



const ios = Platform.OS === 'ios';

export default function App() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });
      fetchCinemas(latitude, longitude);
    } catch (err) {
      setError('Failed to get user location.');
      setLoading(false);
    }
  };

  const fetchCinemas = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const query = `
        [out:json];
        node["amenity"="cinema"](around:10000,${latitude},${longitude});
        out body;
      `;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();

      const cinemaData = data.elements?.map((cinema: any) => ({
        id: cinema.id.toString(),
        name: cinema.tags?.name || 'Unnamed Cinema',
        latitude: cinema.lat,
        longitude: cinema.lon,
      }));

      setCinemas(cinemaData || []);
    } catch (err) {
      setError('Error fetching cinemas.');
    } finally {
      setLoading(false);
    }
  };

  const recenterMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const navigateToCinema = (latitude: number, longitude: number) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-neutral-800">
        <SafeAreaView className={ios ? '-mb-2' : 'mb-3 mt-2'}>
          <StatusBar style="light" />
          <View className="flex-row justify-between items-center mx-4">
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
            </TouchableOpacity>

            <Text className="text-4xl font-bold text-white">
              <Text style={{ color: '#eab308' }}>C</Text>inemas
            </Text>

            <TouchableOpacity>
              <View style={{ width: 30 }} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View className="flex-1 justify-center items-center">
          <LoadingSpinner />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? 'mb-2' : 'mb-3'}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>

          <Text className="text-4xl font-bold text-white">
            <Text style={{ color: '#eab308' }}>C</Text>inemas
          </Text>

          <TouchableOpacity onPress={recenterMap}>
            <MapPinIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation?.latitude || 0,
          longitude: userLocation?.longitude || 0,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
          />
        )}

        {cinemas.map((cinema) => (
          <Marker
            key={cinema.id}
            coordinate={{
              latitude: cinema.latitude,
              longitude: cinema.longitude,
            }}
            title={cinema.name}
            onPress={() => navigateToCinema(cinema.latitude, cinema.longitude)}
          />
        ))}
      </MapView>
    </View>
  );
}
