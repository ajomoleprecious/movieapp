import MovieList from "@/components/MovieList";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Dimensions, Platform, ScrollView, TouchableOpacity, Image } from "react-native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "@/components/Loading";
import { Actor, Movie, Serie } from "@/types";
import { useRoute } from "@react-navigation/native";
import { fallbackpersonImage, getPersonDetails, getPersonMovieCredits, getPersonTvCredits, image342 } from "@/api/db";
import CollapsibleText from "@/components/CollapsibleText";
import SerieList from "@/components/SerieList";
import AsyncStorage from "@react-native-async-storage/async-storage";



const { width, height } = Dimensions.get('window');
const ios = Platform.OS === "ios";
const verticalMargin = ios ? "" : "my-3";

const PersonScreen = () => {
    const router = useRouter();
    const [isFavoriteActor, setIsFavoriteActor] = useState(false);
    const [actormovies, setActorMovies] = useState<Movie[]>([]);
    const [actorTvShows, setActorTvShows] = useState<Serie[]>([]);
    const [loading, setLoading] = useState(true);
    const [actor, setActor] = useState<Actor>();
    const { castId } = useRoute().params as { castId: number };

    useEffect(() => {
        getPersonDetails(castId).then((data) => {
            setActor(data);
        })
        getPersonMovieCredits(castId).then((data) => {
            setActorMovies(data.cast.reverse());
        })
        getPersonTvCredits(castId).then((data) => {
            setActorTvShows(data.cast.reverse());
        })
        AsyncStorage.getItem(`@favoriteActors:${castId}`).then((data) => {
            if (data) {
                setIsFavoriteActor(true);
            }
        })
        setLoading(false);
    }, [castId]);

    const gender = () => {
        if (actor?.gender === 1) {
            return "Female";
        }
        else if (actor?.gender === 2) {
            return "Male";
        }
        else {
            return "N/A";
        }
    }

    const handleToggleFavorite = async () => {
        if (isFavoriteActor) {
            await AsyncStorage.removeItem(`@favoriteActors:${castId}`);
            setIsFavoriteActor(false);
        } else {
            await AsyncStorage.setItem(`@favoriteActors:${castId}`, JSON.stringify(actor));
            setIsFavoriteActor(true);
        }
    }

    return (
        <View className="flex-1 bg-neutral-900">
            <SafeAreaView
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                className={verticalMargin}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: "#eab308" }}
                    className="p-1 rounded-xl"
                >
                    <ChevronLeftIcon size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleFavorite}>
                    <HeartIcon size={35} color={isFavoriteActor ? "#eab308" : "white"} />
                </TouchableOpacity>
            </SafeAreaView>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingTop: 80 }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", shadowColor: "gray", shadowRadius: 40, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1 }}>
                        <View className="items-center rounded-full overflow-hidden h-72 w-72 border border-neutral-500">
                            <Image source={actor?.profile_path ? { uri: image342(actor.profile_path) } : fallbackpersonImage} style={{ width: width * 0.60, height: height * 0.30, backgroundColor: 'gray' }} />
                        </View>
                    </View>
                    <View className="mt-6">
                        <Text className="text-4xl text-white font-bold text-center">{actor?.name}</Text>
                        <Text className="text-xl text-neutral-500 text-center">{actor?.place_of_birth}</Text>
                    </View>
                    <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
                        <View className="border-r-2 flex-1 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-bold">Gender</Text>
                            <Text className="text-neutral-300 text-sm">{gender()}</Text>
                        </View>
                        <View className="border-r-2 flex-1 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-bold">BirthDate</Text>
                            <Text className="text-neutral-300 text-sm">{actor?.birthday ? actor.birthday?.split("-").reverse().join("/") : "N/A"}</Text>
                        </View>
                        <View className="border-r-2 flex-1 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-bold">Known for</Text>
                            <Text className="text-neutral-300 text-sm">{actor?.known_for_department ? actor.known_for_department : "N/A"}</Text>
                        </View>
                        <View className="flex-1 border-r-neutral-400 px-2 items-center">
                            <Text className="text-white font-bold">Popularity</Text>
                            <Text className="text-neutral-300 text-sm">{actor?.popularity.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View className="my-6 mx-4 space-y-2">
                        <Text className="text-white font-bold text-xl">Biography</Text>
                        <CollapsibleText text={actor?.biography || "No biography available"} />
                    </View>
                    {actormovies.length > 0 && (
                        <MovieList data={actormovies} title="Movies" hideSeeAll />
                    )}
                    {actorTvShows.length > 0 && (
                        <SerieList data={actorTvShows} title="Tv Shows" hideSeeAll />
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default PersonScreen;
