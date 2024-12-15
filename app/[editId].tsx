import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/solid";
import React from "react";
import { getComedyMovie, updateComedyMovie } from "@/api/test_api";
import LoadingSpinner from "@/components/Loading";
import { scheduleNotification } from "@/util/usePushNotifications";

const ios = Platform.OS === "ios";

const EditMovieScreen = () => {
    const { editId } = useRoute().params as { editId: number };

    const [title, setTitle] = useState("");
    const [posterURL, setPosterURL] = useState("");
    const [imdbId, setImdbId] = useState("");
    const [rating, setRating] = useState<number>(0);
    const titleInputRef = React.useRef<TextInput>(null);
    const posterURLInputRef = React.useRef<TextInput>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getComedyMovie(editId).then((movie) => {
            setTitle(movie.title);
            setPosterURL(movie.posterURL);
            setImdbId(movie.imdbId);
            setRating(movie.rating);
            setLoading(false);
        });
    }, [editId]);

    const handleUpdateMovie = async () => {
        if (!title) {
            titleInputRef.current?.setNativeProps({ placeholder: "Please enter a title", placeholderTextColor: "#eab308" });
            titleInputRef.current?.focus();
            return;
        }
        if (!posterURL || !posterURL.match(/\.(jpeg|jpg|png)$/)) {
            posterURLInputRef.current?.setNativeProps({ placeholder: "Please enter a poster URL [--.jpeg|--.jpg|--.png]", placeholderTextColor: "#eab308" });
            posterURLInputRef.current?.focus();
            return;
        }
        await updateComedyMovie(editId, { title, posterURL, imdbId, rating });
        await scheduleNotification("Movie Updated", `The movie ${title} has been updated!`);
        router.back();
    };

    return (
        <View className="flex-1 bg-neutral-800">
            <SafeAreaView className={ios ? "mb-2" : "mb-3"}>
                <StatusBar style="light" />
                <View className="flex-row justify-between items-center mx-4">
                    <TouchableOpacity>
                        <View style={{ width: 30 }} />
                    </TouchableOpacity>
                    <Text className="text-4xl font-bold text-white">
                        <Text style={{ color: "#eab308" }}>Edit</Text> Movie
                    </Text>
                    <TouchableOpacity className="p-2 rounded-full m-1 bg-neutral-400" onPress={() => router.back()}>
                        <XMarkIcon size={30} color="white" />
                    </TouchableOpacity>
                </View>
                {loading ?
                    <LoadingSpinner />
                    :
                    <View className="m-4">
                        <Text className="text-white mb-2 text-2xl">Movie Title:</Text>
                        <TextInput
                            placeholder="Edit movie title"
                            placeholderTextColor="lightgray"
                            className="p-4 mb-4 bg-neutral-700 rounded text-white"
                            value={title}
                            ref={titleInputRef}
                            onChangeText={setTitle}
                        />
                        <Text className="text-white mb-2 text-2xl">Poster URL:</Text>
                        <TextInput
                            placeholder="Edit poster URL"
                            placeholderTextColor="lightgray"
                            className="p-4 mb-4 bg-neutral-700 rounded text-white"
                            value={posterURL}
                            ref={posterURLInputRef}
                            onChangeText={setPosterURL}
                        />
                        <TouchableOpacity
                            className="bg-yellow-600 p-4 rounded-full"
                            onPress={handleUpdateMovie}
                        >
                            <Text className="text-center text-white text-lg font-bold">Update Movie</Text>
                        </TouchableOpacity>
                    </View>
                }
            </SafeAreaView>
        </View>
    );
};

export default EditMovieScreen;
