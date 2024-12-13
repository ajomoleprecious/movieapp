import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, Text } from "react-native";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import LoadingSpinner from "@/components/Loading";

const FindCinemas = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied.");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        setError("Failed to get user location.");
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchCinemas = async () => {
      if (!userLocation) return;

      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="cinema"](around:3000,${userLocation.latitude},${userLocation.longitude});out;`;

      try {
        const response = await axios.get(overpassUrl, { timeout: 10000 }); // 10-second timeout
        const data = response.data.elements || [];

        if (data.length === 0) {
          setError("No cinemas found nearby.");
        } else {
          setCinemas(data);
        }
      } catch (err) {
        setError("Failed to fetch nearby cinemas.");
      }
    };

    if (userLocation) fetchCinemas();
  }, [userLocation]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Text className="text-white text-center text-lg">{error}</Text>;

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <LinearGradient colors={["#1E1E1E", "#2C2C2C"]} className="p-5">
        <Text className="text-white text-center text-2xl mb-5">Find Cinemas</Text>

        <MapView
          className="w-full h-96 mb-5 rounded-lg"
          initialRegion={{
            latitude: userLocation?.latitude || 0,
            longitude: userLocation?.longitude || 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {cinemas.map((cinema, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: cinema.lat, longitude: cinema.lon }}
              title={cinema.tags?.name || "Unnamed Cinema"}
            />
          ))}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="blue"
            />
          )}
        </MapView>

        {cinemas.map((cinema, index) => (
          <TouchableOpacity key={index} className="bg-gray-800 rounded-lg mb-4 flex-row shadow-lg">
            <Image source={{ uri: "https://via.placeholder.com/150" }} className="w-32 h-32 rounded-l-lg m-2" />
            <View className="flex-1 justify-center px-3">
              <Text className="text-white text-lg font-semibold">{cinema.tags?.name || "Unnamed Cinema"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </ScrollView>
  );
};

export default FindCinemas;
