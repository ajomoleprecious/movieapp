import { useNavigation, DrawerActions } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Platform, TouchableWithoutFeedback, Image, Dimensions, ScrollView, RefreshControl } from "react-native";
import { Bars3CenterLeftIcon, TrashIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/Loading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Actor } from '@/types';
import { useRouter } from 'expo-router';
import { fallbackMovieImage, image500 } from '@/api/db';
import NoResults from '@/components/NoResults';
import { scheduleNotification } from '@/util/usePushNotifications';

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get('window');

const FavoriteActorsScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [favoriteActors, setFavoriteActors] = useState<Actor[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchFavoriteActors = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const favoriteActorsKeys = keys.filter((key) => key.startsWith("@favoriteActors:"));

            const favoriteActorsData = await AsyncStorage.multiGet(favoriteActorsKeys);

            const actors = favoriteActorsData
                .map(([_, value]) => (value ? JSON.parse(value) : null))
                .filter(actor => actor !== null);

            setFavoriteActors(actors);
        } catch (error) {
            console.error("Error fetching favorite actors:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFavoriteActors();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFavoriteActors();
    }, []);

    const removeFavoriteActor = async (actorId: number) => {
        try {
            await AsyncStorage.removeItem(`@favoriteActors:${actorId}`);
            await scheduleNotification("Favorite Actors", "Actor has been removed from your favorite list!");
            setFavoriteActors(previousFavoriteActors => previousFavoriteActors.filter(actor => actor.id !== actorId));
        } catch (error) {
            console.error("Error deleting actor:", error);
        }
    };

    const removeAllFavoriteActors = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const favoriteActorsKeys = keys.filter((key) => key.startsWith("@favoriteActors:"));

            await AsyncStorage.multiRemove(favoriteActorsKeys);
            await scheduleNotification("Favorite Actors", "All favorite actors have been removed from your favorite list!");
            setFavoriteActors([]);
        } catch (error) {
            console.error("Error deleting actors:", error);
        }
    }

    return (
        <View className="flex-1 bg-neutral-800">
            <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
                <StatusBar style="light" />
                <View className="flex-row justify-between items-center mx-4">
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
                    </TouchableOpacity>

                    <Text className="text-4xl font-bold text-white">
                        <Text style={{ color: "#eab308" }}>A</Text>ctors
                    </Text>

                    <TouchableOpacity className="p-2 rounded-full bg-neutral-700" onPress={removeAllFavoriteActors}>
                        <TrashIcon size={28} strokeWidth={2} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />
                    }
                    className="space-y-3"
                >
                    {favoriteActors.length === 0 ? (
                        <NoResults text="No favorite actors yet." />
                    ) :
                        <View className="flex-row flex-wrap justify-between mt-5">
                            {favoriteActors
                                .sort((a, b) => b.popularity - a.popularity)
                                .map((actor, index) => (
                                    <View key={index} className="mb-4">
                                        <TouchableWithoutFeedback
                                            onPress={() => router.push(`/(actor)/${actor.id}`)}
                                        >
                                            <View className="relative">
                                                <Image
                                                    source={actor.profile_path ? { uri: image500(actor.profile_path) } : fallbackMovieImage}
                                                    style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => removeFavoriteActor(actor.id)}
                                                    className="absolute top-0 right-0 p-3"
                                                    style={{ backgroundColor: "gray", borderTopRightRadius: 24, borderBottomLeftRadius: 24 }}
                                                >
                                                    <TrashIcon size={25} color="#eab308" />
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <Text className="text-neutral-300 text-lg text-center mt-2">
                                            {actor?.name?.length > 24 ? actor.name.substring(0, 24) + "..." : actor.name}
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    }
                </ScrollView>
            )}
        </View>
    );
};

export default FavoriteActorsScreen;
