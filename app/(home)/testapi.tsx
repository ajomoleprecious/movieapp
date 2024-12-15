import LoadingSpinner from "@/components/Loading";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { View, SafeAreaView, TouchableOpacity, Platform, Text, Image, TextInput, FlatList, TouchableWithoutFeedback, Dimensions, ScrollView, RefreshControl } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon, PlusIcon, TrashIcon, XMarkIcon } from "react-native-heroicons/solid";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { MovieTest } from "@/types";
import { deleteComedyMovie, getComedyMovies } from "@/api/test_api";
import { fallbackMovieImage } from "@/api/db";
import React from "react";
import { scheduleNotification } from "@/util/usePushNotifications";

const ios = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const TestApi = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [searchState, setSearchState] = useState(false);
    const [movies, setMovies] = useState<MovieTest[]>();
    const [loading, setLoading] = useState(true);
    const [filteredMovies, setFilteredMovies] = useState<MovieTest[]>();
    const [refreshing, setRefreshing] = React.useState(false);
    const inputRef = React.useRef<TextInput>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadData = () => {
        setLoading(true);
        getComedyMovies().then((data) => {
            setMovies(data);
            setFilteredMovies(data);
            setLoading(false);
            setRefreshing(false);
        });
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = (text: string) => {
        setSearch(text);
        const filtered = movies?.filter((movie) =>
            movie.title.toLowerCase().startsWith(text.toLowerCase())
        );
        setFilteredMovies(filtered);
    };

    useEffect(() => {
        handleSearch(search);
    }, [search]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadData();
    }, []);

    const handleOnPress = () => {
        setSearchState(!searchState);
        if (searchState) {
            inputRef.current?.blur();
        } else {
            inputRef.current?.focus();
        }
    }

    const deleteMovie = async (id: number) => {
        setDeletingId(id);
        try {
            const result = await deleteComedyMovie(id);
            if (result) {
                await scheduleNotification("Movies", "Movie has been removed from the list!");
                setFilteredMovies((prevMovies) => prevMovies?.filter((movie) => movie.id !== id));
            } else {
                console.warn("For some reason, i get false from the deleteComedyMovie function");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    return (
        <View className="flex-1 bg-neutral-800">
            <SafeAreaView className={ios ? 'mb-2 mt-2' : 'mb-3'}>
                <StatusBar style="light" />
                <View className="flex-row justify-between items-center mx-4">
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
                    </TouchableOpacity>

                    <Text className="text-4xl font-bold text-white">
                        <Text style={{ color: '#eab308' }}>API</Text> Test
                    </Text>

                    <TouchableOpacity
                        className="p-2 rounded-full bg-neutral-700"
                        onPress={() => handleOnPress()}
                    >
                        <MagnifyingGlassIcon size={30} strokeWidth={2} color={searchState ? "#eab308" : "white"} />
                    </TouchableOpacity>
                </View>
                {searchState && (
                    <>
                        <View className="mx-4 mt-2 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
                            <TextInput
                                ref={inputRef}
                                placeholder={`Search for movies`}
                                placeholderTextColor={'lightgray'}
                                style={{ flex: 1, color: "white", padding: 18, fontSize: 18, fontWeight: "600", letterSpacing: 0.05 }}
                                value={search} onChangeText={(text) => handleSearch(text)} />
                            <TouchableOpacity
                                onPress={() => { { search.length > 0 ? setSearch("") : setSearchState(false) } }}
                                className="p-3 rounded-full m-1 bg-neutral-400"
                            >
                                <XMarkIcon size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="mx-4 mt-5" style={{ marginBottom: 15 }}>
                            <Text className="text-white font-semibold text-xl ml-2">Results: {filteredMovies?.length}</Text>
                        </View>
                    </>
                )}
            </SafeAreaView>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <LoadingSpinner />
                </View>
            ) : (
                <>
                    <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#eab308" />
                        }>
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                paddingHorizontal: 16,
                            }}
                        >
                            {filteredMovies?.map((item) => (
                                <TouchableWithoutFeedback key={item.id} onPress={() => { router.push(`../${item.id}`) }}>
                                    <View style={{ width: (width - 48) / 2, marginBottom: 16, alignItems: "center" }}>
                                        <View className="relative">
                                            <Image
                                                source={
                                                    item.posterURL
                                                        ? { uri: item.posterURL }
                                                        : fallbackMovieImage
                                                }
                                                style={{ width: width * 0.44, height: height * 0.30, borderRadius: 24, backgroundColor: "gray" }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => item.id !== undefined && deleteMovie(item.id)}
                                                className="absolute top-0 right-0 p-2"
                                                style={{
                                                    backgroundColor: "gray",
                                                    borderTopRightRadius: 24,
                                                    borderBottomLeftRadius: 24,
                                                    opacity: deletingId === item.id ? 0.5 : 1,
                                                }}
                                                disabled={deletingId === item.id}
                                            >
                                                {deletingId === item.id ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    <TrashIcon size={25} color="#eab308" />
                                                )}
                                            </TouchableOpacity>

                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                marginTop: 8,
                                                textAlign: "center",
                                            }}
                                            className="text-white"
                                        >
                                            {item.title.length > 20
                                                ? item.title.substring(0, 20) + "..."
                                                : item.title}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        className="bg-yellow-600 p-4 rounded-full m-4"
                        onPress={() => router.push("../addtestapi")}
                        style={{ position: "absolute", bottom: 20, right: 20 }}
                    >
                        <PlusIcon size={30} color="white" />
                    </TouchableOpacity>
                </>
            )}

        </View>
    );
}

export default TestApi;