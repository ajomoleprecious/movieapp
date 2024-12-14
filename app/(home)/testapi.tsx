import LoadingSpinner from "@/components/Loading";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { View, SafeAreaView, TouchableOpacity, Platform, Text, Image, TextInput, FlatList, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/solid";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { MovieTest } from "@/types";
import { getComedyMovies } from "@/api/test_api";
import { fallbackMovieImage } from "@/api/db";

const ios = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const TestApi = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState("");
    const [searchState, setSearchState] = useState(false);
    const [movies, setMovies] = useState<MovieTest[]>();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        getComedyMovies().then((data) => {
            setMovies(data);
            setLoading(false);
        });
    }, []);

    let filteredMovies = movies;
    
    const handleSearch = (text: string) => {
        setSearch(text);
        const filtered = movies?.filter((movie) =>
            movie.title.toLowerCase().startsWith(text.toLowerCase())
        );
        filteredMovies = filtered;
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
                        <Text style={{ color: '#eab308' }}>API</Text> Test
                    </Text>

                    <TouchableOpacity
                        className="p-2 rounded-full bg-neutral-700"
                        onPress={() => setSearchState(!searchState)}
                    >
                        <MagnifyingGlassIcon size={30} strokeWidth={2} color={searchState ? "#eab308" : "white"} />
                    </TouchableOpacity>
                </View>
                {searchState && (
                    <View className="mx-4 mt-2 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
                        <TextInput
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
                )}
            </SafeAreaView>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <LoadingSpinner />
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredMovies}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        marginBottom: 16,
                    }}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback
                            onPress={() => { }}
                        >
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={
                                        item.posterURL
                                            ? { uri: item.posterURL }
                                            : fallbackMovieImage
                                    }
                                    style={{
                                        width: (width - 48) / 2,
                                        height: height * 0.3,
                                        borderRadius: 16,
                                        backgroundColor: "gray",
                                    }}
                                />
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
                    )}
                />
            )}

        </View>
    );
}

export default TestApi;