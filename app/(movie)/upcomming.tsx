import { fallbackMovieImage, getUpcomingMovies, getUpcomingMoviesPage, image500 } from "@/api/db";
import LoadingSpinner from "@/components/Loading";
import { Movie } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Platform, SafeAreaView, TouchableOpacity, View, Text, FlatList, TouchableWithoutFeedback, Image } from "react-native";
import { ChevronLeftIcon, MagnifyingGlassIcon } from "react-native-heroicons/solid";

const { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const verticalMargin = ios ? "" : "mt-8";

const UpcommingMovies = () => {
    const [loading, setLoading] = useState(true);
    const [upcommingMovies, setUpcommingMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        getUpcomingMovies().then((data) => {
            setUpcommingMovies(data);
            setLoading(false);
        });
    }, []);

    const loadMore = () => {
        getUpcomingMoviesPage(page + 1).then((data) => {
            setUpcommingMovies([...upcommingMovies, ...data]);
            setPage(page + 1);
        });
    };

    return (
        <View className="flex-1 bg-neutral-900">
            <SafeAreaView
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    paddingHorizontal: 16,
                    marginHorizontal: 18,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                <Text className="text-4xl font-bold text-white">
                    <Text style={{ color: "#eab308" }}>U</Text>pcomming
                </Text>
                <TouchableOpacity
                    className="p-2 rounded-full bg-neutral-700"
                    onPress={() => router.push("../(search)")}
                >
                    <MagnifyingGlassIcon size={28} strokeWidth={2} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <SafeAreaView style={{ marginTop: 100 }} className={verticalMargin}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={upcommingMovies}
                        numColumns={2}
                        columnWrapperStyle={{
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                            marginBottom: 16,
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback
                                onPress={() => router.push(`/(movie)/${item.id}`)}
                            >
                                <View style={{ alignItems: "center" }}>
                                    <Image
                                        source={
                                            item.poster_path
                                                ? { uri: image500(item.poster_path) }
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
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            <View
                                style={{
                                    width: "100%",
                                    height: height * 0.1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "transparent",
                                    marginTop: 16,
                                }}
                            >
                                <LoadingSpinner />
                            </View>
                        }
                    />
                </SafeAreaView>
            )}
        </View>
    );
};

export default UpcommingMovies;
