import { useNavigation, DrawerActions } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Platform, TouchableWithoutFeedback, Image, Dimensions, ScrollView, RefreshControl } from "react-native";
import { Bars3CenterLeftIcon, TrashIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/Loading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Serie } from '@/types';
import { useRouter } from 'expo-router';
import { fallbackMovieImage, image500 } from '@/api/db';
import NoResults from '@/components/NoResults';
import { scheduleNotification } from '@/util/usePushNotifications';
import React from 'react';


const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get('window');

const FavoriteTvSeriesScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [favoriteTvSeries, setFavoriteTvSeries] = useState<Serie[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchFavoriteTvSeries = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const favoriteTvSeriesKeys = keys.filter((key) => key.startsWith("@favoriteTvSeries:"));

            const favoriteTvSeriesData = await AsyncStorage.multiGet(favoriteTvSeriesKeys);

            const tvseries = favoriteTvSeriesData
                .map(([_, value]) => (value ? JSON.parse(value) : null))
                .filter(serie => serie !== null);

            setFavoriteTvSeries(tvseries);
        } catch (error) {
            console.error("Error fetching favorite series:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFavoriteTvSeries();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFavoriteTvSeries();
    }, []);

    const removeFavoriteTvSerie = async (serieId: number) => {
        try {
            await AsyncStorage.removeItem(`@favoriteTvSeries:${serieId}`);
            await scheduleNotification("Favorite Tv Series", "Tv Series has been removed from your favorite list!");
            setFavoriteTvSeries(previousFavoriteTvSeries => previousFavoriteTvSeries.filter(serie => serie.id !== serieId));
        } catch (error) {
            console.error("Error deleting serie:", error);
        }
    };

    const removeAllFavoriteTvSeries = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const favoriteTvSeriesKeys = keys.filter((key) => key.startsWith("@favoriteTvSeries:"));

            await AsyncStorage.multiRemove(favoriteTvSeriesKeys);
            await scheduleNotification("Favorite Tv Series", "All tv series have been removed from your favorite list!");
            setFavoriteTvSeries([]);
        } catch (error) {
            console.error("Error deleting all series:", error);
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
                        <Text style={{ color: "#eab308" }}>Tv</Text> Series
                    </Text>

                    <TouchableOpacity className="p-2 rounded-full bg-neutral-700" onPress={removeAllFavoriteTvSeries}>
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
                    {favoriteTvSeries.length === 0 ? (
                        <NoResults text='No favorite tv series yet' />
                    ) :
                        <View className="flex-row flex-wrap justify-between mt-5">
                            {favoriteTvSeries
                                .sort((a, b) => b.popularity - a.popularity)
                                .map((serie, index) => (
                                    <View key={index} className="mb-4">
                                        <TouchableWithoutFeedback
                                            onPress={() => router.push(`/(tv)/${serie.id}`)}
                                        >
                                            <View className="relative">
                                                <Image
                                                    source={serie.poster_path ? { uri: image500(serie.poster_path) } : fallbackMovieImage}
                                                    style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => removeFavoriteTvSerie(serie.id)}
                                                    className="absolute top-0 right-0 p-2"
                                                    style={{ backgroundColor: "gray", borderTopRightRadius: 24, borderBottomLeftRadius: 24 }}
                                                >
                                                    <TrashIcon size={25} color="#eab308" />
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <Text className="text-neutral-300 text-lg text-center mt-2">
                                            {serie?.name?.length > 24 ? serie.name.substring(0, 24) + "..." : serie.name}
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

export default FavoriteTvSeriesScreen;
