import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, TextInput } from "react-native";
import { FilmIcon, HeartIcon, PlayIcon } from "react-native-heroicons/solid";
import { ChevronLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "@/components/Cast";
import MovieList from "@/components/MovieList";
import LoadingSpinner from "@/components/Loading";
import { fallbackMovieImage, getCollectionDetails, getMovieDetails, getMovieImages, getMovieReviews, getMovieVideos, image185, image500 } from "@/api/db";
import { Credit, Movie, MovieDetail, Review } from "@/types";
import { ModalComp } from "@/components/Modal";
import { VideoModal } from "@/components/VideoModal";
import { ImageModal } from "@/components/ImageSlider";
import Carousel from 'react-native-snap-carousel';
import ReviewCard from "@/components/ReviewCard";
import CollapsibleText from "@/components/CollapsibleText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleNotification } from "@/util/usePushNotifications";
import * as Notifications from 'expo-notifications';




const { width, height } = Dimensions.get('window');
// const ios = Platform.OS === "ios";

const MovieScreen = () => {
    const router = useRouter();
    const { movieId } = useRoute().params as { movieId: number };
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [credit, setCredit] = useState<Credit | undefined>();
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [movieItem, setMovieItem] = useState<MovieDetail>();
    const [videoId, setVideoId] = useState<string | undefined>();
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [movieImages, setMovieImages] = useState<string[]>([]);
    const [collection, setCollection] = useState<Movie[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });
        return () => subscription.remove();
    }, []);


    useEffect(() => {
        getMovieDetails(movieId).then((data) => {
            setMovieItem(data);
            setCredit(data.credits);
            setSimilarMovies(data.similar.results);
            {
                data.belongs_to_collection?.id &&
                    getCollectionDetails(data.belongs_to_collection?.id).then((collection) => {
                        setCollection(collection.parts);
                    });
            }
        });
        getMovieVideos(movieId).then((data) => {
            if (data.filter((video: { name: string; }) => video.name === "Official Trailer").length !== 0) {
                setVideoId(data.filter((video: { name: string; }) => video.name === "Official Trailer")[0]?.key);
            }
            else {
                setVideoId(data.filter((type: { type: string; }) => type.type === "Trailer")[0]?.key);
            }
        });
        getMovieImages(movieId).then((data) => {
            setMovieImages(data);
        });
        getMovieReviews(movieId).then((data) => {
            setReviews(data);
        });
        AsyncStorage.getItem(`@favoriteMovies:${movieId}`).then((data) => {
            if (data) {
                setIsFavorite(true);
            }
        });
        setLoading(false);
    }, [movieId]);

    const handleToggleFavorite = async () => {
        if (isFavorite) {
            await AsyncStorage.removeItem(`@favoriteMovies:${movieItem?.id}`);
            setIsFavorite(false);
        } else {
            await AsyncStorage.setItem(`@favoriteMovies:${movieItem?.id}`, JSON.stringify(movieItem));
            await scheduleNotification("Movie Added", `You have added ${movieItem?.title} to your favorites movies!`);
            setIsFavorite(true);
        }        
    }

    return (
        <View className="bg-neutral-800 flex-1">
            <SafeAreaView
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    marginHorizontal: 16,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: "#eab308" }}
                    className="p-1 rounded-xl"
                >
                    <ChevronLeftIcon size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleFavorite}>
                    <HeartIcon size={35} color={isFavorite ? "#eab308" : "white"} />
                </TouchableOpacity>
            </SafeAreaView>
            {loading ? (
                <LoadingSpinner />
            ) :
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="w-full">
                        <View>
                            {movieItem?.backdrop_path ?
                                <Image source={{ uri: movieItem.backdrop_path ? image500(movieItem.backdrop_path) : fallbackMovieImage.uri }} style={{ width: width, height: height * 0.40 }} />
                                :
                                <Image source={{ uri: movieItem?.poster_path ? image500(movieItem.poster_path) : fallbackMovieImage.uri }} style={{ width: width, height: height * 0.40, borderRadius: 24, backgroundColor: "gray" }} />
                            }
                            <LinearGradient
                                colors={['transparent', 'rgba(23,23,23,0.3)', 'rgba(23,23,23,1)']}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={{
                                    width: width,
                                    height: height * 0.40,
                                    position: 'absolute',
                                    bottom: 0,
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: -(height * 0.09) }}
                        className="space-y-3">
                        <Text className="text-white text-5xl font-bold text-center tracking-wider mt-2">{movieItem?.title}</Text>
                        <Text className="text-neutral-400 font-semibold text-xl text-center mt-3">{movieItem?.status} • {movieItem?.release_date?.split("-")[0]} • {movieItem?.runtime ? `${Math.floor(movieItem.runtime / 60)}h ${movieItem.runtime % 60}m` : "N/A"}</Text>
                        <View style={{ position: 'absolute', top: -50, right: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {videoId && <TouchableOpacity className=" p-2 rounded-3xl"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#eab308" }}
                                onPress={() => setShowVideoModal(true)}
                            >
                                <PlayIcon size={35} color="white" />
                            </TouchableOpacity>}
                        </View>
                        <View style={{ position: 'absolute', top: -50, left: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {movieImages && movieImages.length > 0 && <TouchableOpacity className=" p-2 rounded-3xl"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#eab308" }}
                                onPress={() => setShowImagesModal(true)}
                            >
                                <FilmIcon size={35} color="white" />
                            </TouchableOpacity>}
                        </View>
                        <ModalComp isOpen={showImagesModal} withInput={false}>
                            <ImageModal images={movieImages} setShowImageModal={setShowImagesModal} />
                        </ModalComp>
                        <ModalComp isOpen={showVideoModal} withInput={false}>
                            <VideoModal videoId={videoId} setShowVideoModal={setShowVideoModal} />
                        </ModalComp>
                        <View className="flex-row flex-wrap justify-center mx-4 space-x-2 mt-3">
                            {movieItem?.genres.map((genre, index) => (
                                <Text key={index} className="text-neutral-400 font-semibold text-xl">
                                    {genre.name}{index !== movieItem.genres.length - 1 && " • "}
                                </Text>
                            ))}
                        </View>
                        <View className="my-6 mx-4 space-y-2">
                            <Text className="text-white font-bold text-xl">Overview</Text>
                            <CollapsibleText text={movieItem?.overview || "No overview available"} />
                        </View>
                    </View>
                    {credit && <Cast router={router} credit={credit} />}
                    {collection.length > 0 && <MovieList title="Collection" hideSeeAll={true} data={collection} />}
                    {reviews.length > 0 &&
                        <>
                            <Text className="text-white text-3xl font-bold text-center mb-3">Reviews</Text>
                            <Carousel
                                data={reviews}
                                renderItem={({ item }) => (
                                    <ReviewCard name={item.author} avatar={item.author_details.avatar_path ? image185(item.author_details.avatar_path) : fallbackMovieImage.uri} rating={item.author_details.rating} content={item.content} />
                                )}
                                sliderWidth={width}
                                itemWidth={width * 0.8}
                                inactiveSlideScale={0.9}
                                inactiveSlideOpacity={0.3}
                                slideStyle={{ display: 'flex', alignItems: 'center' }}
                                firstItem={0}
                                layout="default"
                                vertical={false}
                                loop={true}
                                autoplay={true}
                                autoplayInterval={8000}
                                autoplayDelay={0}
                                enableSnap={true}
                                shouldOptimizeUpdates={true}
                            />
                        </>
                    }
                    {similarMovies.length > 0 && <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovies} />}
                </ScrollView>
            }
        </View>
    );
};

export default MovieScreen;