import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image } from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "@/components/Loading";
import { Actor, Movie, Serie } from "@/types";
import { fallbackMovieImage, fallbackpersonImage, image500, searchMovies, searchPeople, searchTvShows } from "@/api/db";
import debounce from 'lodash.debounce';
import NoResults from "@/components/NoResults";


type Category = "movie" | "tv show" | "actor";

const { width, height } = Dimensions.get('window');

const SearchScreen = () => {
    const router = useRouter();
    const [category, setCategory] = useState<Category>("movie");
    const [movieResults, setMovieResults] = useState<Movie[]>([]);
    const [tvResults, setTvResults] = useState<Serie[]>([]);
    const [actorResults, setActorResults] = useState<Actor[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        clearResults();
    }, [category]);

    const clearResults = () => {
        setMovieResults([]);
        setTvResults([]);
        setActorResults([]);
        setSearch("");
        setLoading(false);
    };

    const debouncedSearch = useCallback(
        debounce(async (searchQuery, category) => {
            setLoading(true);
            if (category === "movie") {
                const data = await searchMovies(searchQuery);
                setMovieResults(data);
            }
            if (category === "tv show") {
                const data = await searchTvShows(searchQuery);
                setTvResults(data);
            }
            if (category === "actor") {
                const data = await searchPeople(searchQuery);
                setActorResults(data);
            }
            setLoading(false);
        }, 1500),
        []
    );

    useEffect(() => {
        if (search.length > 1) {
            debouncedSearch(search, category);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [search, category]);


    return (
        <SafeAreaView className="bg-neutral-800 flex-1">
            <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
                <TextInput
                    placeholder={`Search for ${category}s`}
                    placeholderTextColor={'lightgray'}
                    style={{ flex: 1, color: "white", padding: 18, fontSize: 18, fontWeight: "600", letterSpacing: 0.05 }}
                    value={search} onChangeText={(text) => setSearch(text)} />
                <TouchableOpacity
                    onPress={() => {
                        { search.length > 0 ? clearResults() : router.replace("/(home)") }
                    }}
                    className="p-3 rounded-full m-1 bg-neutral-400"
                >
                    <XMarkIcon size={25} color="white" />
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-between mx-4 gap-5">
                <TouchableOpacity
                    onPress={() => setCategory("movie")}
                    className={`p-2 flex-1 items-center rounded-full ${category === "movie" ? "bg-orange-600" : "bg-neutral-700"}`}
                >
                    <Text className="text-white font-bold text-xl">Movies</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCategory("tv show")}
                    className={`p-2 flex-1 items-center rounded-full ${category === "tv show" ? "bg-orange-600" : "bg-neutral-700"}`}
                >
                    <Text className="text-white font-bold text-xl">TV Shows</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setCategory("actor")}
                    className={`p-2 flex-1 items-center rounded-full ${category === "actor" ? "bg-orange-600" : "bg-neutral-700"}`}
                >
                    <Text className="text-white font-bold text-xl">Actors</Text>
                </TouchableOpacity>
            </View>
            <View className="mx-4 mt-5" style={{ marginBottom: 15 }}>
                {category === "movie" && movieResults.length > 0 && (
                    <Text className="text-white font-semibold text-xl ml-2">Results ({String(movieResults.length)})</Text>
                )}
                {category === "tv show" && tvResults.length > 0 && (
                    <Text className="text-white font-semibold text-xl ml-2">Results ({String(tvResults.length)})</Text>
                )}
                {category === "actor" && actorResults.length > 0 && (
                    <Text className="text-white font-semibold text-xl ml-2">Results ({String(actorResults.length)})</Text>
                )}
            </View>

            {loading && <LoadingSpinner />}
            {movieResults.length === 0 && tvResults.length === 0 && actorResults.length === 0 && !loading && <NoResults />}
            {category === "movie" && movieResults.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    className="space-y-3"
                >
                    <View className="flex-row flex-wrap justify-between mt-5">
                        {movieResults
                            .sort((a, b) => b.popularity - a.popularity)
                            .map((movie, index) => (
                                <TouchableWithoutFeedback
                                    key={index}
                                    onPress={() => router.push(`/(movie)/${movie.id}`)}
                                >
                                    <View className="space-y-2 mb-4">
                                        <Image
                                            source={movie.poster_path ? { uri: image500(movie.poster_path) } : fallbackMovieImage}
                                            style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }} />
                                        <Text
                                            className="text-neutral-300 text-lg text-center"
                                        >
                                            {movie?.title?.length > 24 ? movie.title.substring(0, 24) + "..." : movie.title}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                    </View>
                </ScrollView>
            )}
            {category === "tv show" && tvResults.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    className="space-y-3"
                >
                    <View className="flex-row flex-wrap justify-between mt-5">
                        {tvResults
                            .sort((a, b) => b.popularity - a.popularity)
                            .map((tv, index) => (
                                <TouchableWithoutFeedback
                                    key={index}
                                    onPress={() => router.push(`/(tv)/${tv.id}`)}
                                >
                                    <View className="space-y-2 mb-4">
                                        <Image
                                            source={tv.poster_path ? { uri: image500(tv.poster_path) } : fallbackMovieImage}
                                            style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }} />
                                        <Text
                                            className="text-neutral-300 text-lg text-center"
                                        >
                                            {tv?.name?.length > 24 ? tv.name.substring(0, 24) + "..." : tv.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                    </View>
                </ScrollView>
            )}
            {category === "actor" && actorResults.length > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    className="space-y-3"
                >
                    <View className="flex-row flex-wrap justify-between mt-5">
                        {actorResults
                            .sort((a, b) => b.popularity - a.popularity)
                            .map((actor, index) => (
                                <TouchableWithoutFeedback
                                    key={index}
                                    onPress={() => router.push(`/(actor)/${actor.id}`)}
                                >
                                    <View className="space-y-2 mb-4">
                                        <Image
                                            source={actor.profile_path ? { uri: image500(actor.profile_path) } : fallbackpersonImage}
                                            style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }} />
                                        <Text
                                            className="text-neutral-300 text-lg text-center"
                                        >
                                            {actor?.name?.length > 24 ? actor.name.substring(0, 24) + "..." : actor.name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default SearchScreen;
