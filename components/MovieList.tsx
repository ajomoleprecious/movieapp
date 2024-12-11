import { fallbackMovieImage, image500 } from "@/api/db";
import { Movie } from "@/types";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Image, Dimensions } from "react-native";
import { CalendarDaysIcon, StarIcon } from "react-native-heroicons/solid";

type MovieListProps = {
    title: string;
    hideSeeAll?: boolean;
    data: Movie[]
}


const { width, height } = Dimensions.get('window');

const MovieList = ({ title, data, hideSeeAll }: MovieListProps) => {
    const router = useRouter();

    const IconComponent = () => {
        if (title === "Upcomming") {
            return <CalendarDaysIcon size={25} color="#FF4500" />;
        }
        if (title === "Top Rated") {
            return <StarIcon size={25} color="#FF4500" />;
        }
        return null;
    };

    const routeLink = (title: string) => {
        if (title === "Upcomming") {
            return "../(movie)/upcomming";
        }
        if (title === "Top Rated") {
            return "../(movie)/toprated";
        }
        return "./(home)/index";
    }

    return (
        <View style={{ marginBottom: 32, marginTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 20 }}>
                <View className="flex-row items-center">
                    <Text className="font-bold text-white" style={{ fontSize: 22 }}>{title} </Text>
                    <IconComponent />
                </View>
                {!hideSeeAll && (
                    <TouchableOpacity className="p-2 rounded-full bg-neutral-700" onPress={() => router.push(routeLink(title))}>
                        <Text style={{ color: "#eab308" }} className="text-lg">See All</Text>
                    </TouchableOpacity>
                )}
            </View>
            {!data.length && (
                <Text className="text-white text-center">No movies found</Text>
            )}
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {data && data.map((movie, index) => (
                    <TouchableWithoutFeedback
                        key={index}
                        onPress={() => router.push(`/(movie)/${movie!.id}`)}
                    >
                        <View style={{ marginRight: 16, marginTop: 4, alignItems: "center" }}>
                            <Image
                                source={movie.poster_path ? { uri: image500(movie.poster_path) } : fallbackMovieImage}
                                style={{ width: width * 0.33, height: height * 0.22, borderRadius: 24, backgroundColor: "gray"}}/>
                            <Text
                                style={{ fontSize: 18 }}
                                className="text-white ml-1"
                            >
                                {movie.title.length > 14 ? movie.title.substring(0, 14) + "..." : movie.title}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                ))}
            </ScrollView>
        </View>
    );
};

export default MovieList;
