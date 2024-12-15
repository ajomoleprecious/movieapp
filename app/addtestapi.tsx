import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Platform } from "react-native";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { XMarkIcon } from "react-native-heroicons/solid";
import React from "react";
import { MovieTest } from "@/types";
import { scheduleNotification } from "@/util/usePushNotifications";
import { createComedyMovie } from "@/api/test_api";

const ios = Platform.OS === "ios";

const AddMovieScreen = () => {
    const [title, setTitle] = useState("");
    const [posterURL, setPosterURL] = useState("");
    const imdbId = "tt0000000";
    const rating = 0;
    const titleInputRef = React.useRef<TextInput>(null);
    const posterURLInputRef = React.useRef<TextInput>(null);

    const handleAddMovie = async () => {
        if (!title) {
            titleInputRef.current?.setNativeProps({ placeholder: "Please enter a title", placeholderTextColor: "#eab308" });
            titleInputRef.current?.focus();
            return;
        }
        if (!posterURL || !posterURL.match(/\.(jpeg|jpg|png)$/)) {
            posterURLInputRef.current?.setNativeProps({ 
                placeholder: "Please enter a poster URL [--.jpeg|--.jpg|--.png]", 
                placeholderTextColor: "#eab308"
            });
            posterURLInputRef.current?.setState({ posterURL: "A valid URL ends with .jpeg, .jpg, or .png" });
            posterURLInputRef.current?.focus();
            return;
        }
        const movieToAdd = { title, posterURL, imdbId, rating } as MovieTest;
        await createComedyMovie(movieToAdd);
        await scheduleNotification("New Movie", `The movie ${title} has been added!`);
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
                        <Text style={{ color: "#eab308" }}>Add</Text> New Movie
                    </Text>
                    <TouchableOpacity className="p-2 rounded-full m-1 bg-neutral-400" onPress={() => router.back()}>
                        <XMarkIcon size={30} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="m-4">
                    <Text className="text-white mb-2 text-2xl">Movie Title:</Text>
                    <TextInput
                        placeholder="Enter movie title"
                        placeholderTextColor="lightgray"
                        className="p-4 mb-4 bg-neutral-700 rounded text-white"
                        value={title}
                        ref={titleInputRef}
                        onChangeText={setTitle}
                    />

                    <Text className="text-white mb-2 text-2xl">Poster URL:</Text>
                    <TextInput
                        placeholder="Enter poster URL"
                        placeholderTextColor="lightgray"
                        className="p-4 mb-4 bg-neutral-700 rounded text-white"
                        value={posterURL}
                        ref={posterURLInputRef}
                        onChangeText={setPosterURL}
                    />

                    <TouchableOpacity
                        className="bg-yellow-600 p-4 rounded-full"
                        onPress={handleAddMovie}
                    >
                        <Text className="text-center text-white text-lg font-bold">Add Movie</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default AddMovieScreen;
