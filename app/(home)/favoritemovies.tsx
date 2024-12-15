import { useNavigation, DrawerActions } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Platform, TouchableWithoutFeedback, Image, Dimensions, ScrollView, RefreshControl } from "react-native";
import { Bars3CenterLeftIcon, TrashIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/Loading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from '@/types';
import { useRouter } from 'expo-router';
import { fallbackMovieImage, image500 } from '@/api/db';
import NoResults from '@/components/NoResults';
import { scheduleNotification } from '@/util/usePushNotifications';
import React from 'react';

const ios = Platform.OS === "ios";
const { width, height } = Dimensions.get('window');

const FavoriteMoviesScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const fetchFavoriteMovies = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const favoriteMovieKeys = keys.filter((key) => key.startsWith("@favoriteMovies:"));

            const favoriteMoviesData = await AsyncStorage.multiGet(favoriteMovieKeys);

            const movies = favoriteMoviesData
                .map(([_, value]) => (value ? JSON.parse(value) : null))
                .filter(movie => movie !== null);

            setFavoriteMovies(movies);
        } catch (error) {
            console.error("Error fetching favorite movies:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFavoriteMovies();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchFavoriteMovies();
    }, []);

    const removeFavoriteMovie = async (movieId: number) => {
        try {
            await AsyncStorage.removeItem(`@favoriteMovies:${movieId}`);
            await scheduleNotification("Favorite Movies", "Movie has been removed from your favorite list!");
            setFavoriteMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    const removeAllFavoriteMovies = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const favoriteMovieKeys = keys.filter((key) => key.startsWith("@favoriteMovies:"));

            await AsyncStorage.multiRemove(favoriteMovieKeys);
            await scheduleNotification("Favorite Movies", "All movies have been removed from your favorite list!");
            setFavoriteMovies([]);
        } catch (error) {
            console.error("Error deleting movies:", error);
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
                        <Text style={{ color: "#eab308" }}>M</Text>ovies
                    </Text>

                    <TouchableOpacity className="p-2 rounded-full bg-neutral-700" onPress={removeAllFavoriteMovies}>
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
                    {favoriteMovies.length === 0 ? (
                        <NoResults text="No favorite movies yet." />
                    ) :
                        <View className="flex-row flex-wrap justify-between mt-5">
                            {favoriteMovies
                                .sort((a, b) => b.popularity - a.popularity)
                                .map((movie, index) => (
                                    <View key={index} className="mb-4">
                                        <TouchableWithoutFeedback
                                            onPress={() => router.push(`/(movie)/${movie.id}`)}
                                        >
                                            <View className="relative">
                                                <Image
                                                    source={movie.poster_path ? { uri: image500(movie.poster_path) } : fallbackMovieImage}
                                                    style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => removeFavoriteMovie(movie.id)}
                                                    className="absolute top-0 right-0 p-2"
                                                    style={{ backgroundColor: "gray", borderTopRightRadius: 24, borderBottomLeftRadius: 24 }}
                                                >
                                                    <TrashIcon size={25} color="#eab308" />
                                                </TouchableOpacity>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <Text className="text-neutral-300 text-lg text-center mt-2">
                                            {movie?.title?.length > 24 ? movie.title.substring(0, 24) + "..." : movie.title}
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

export default FavoriteMoviesScreen;
