import { image500, fallbackMovieImage, image185, getTvShowDetails, getTvSeasonDetails, getTvSeasonCredits, getTvShowReviews, getSimilarTvShows, getTvShowImages, getTvShowVideos } from "@/api/db";
import { ImageModal } from "@/components/ImageSlider";
import LoadingSpinner from "@/components/Loading";
import { ModalComp } from "@/components/Modal";
import { VideoModal } from "@/components/VideoModal";
import { Credit, Episode, Review, Serie, SerieDetail } from "@/types";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, View, SafeAreaView, TouchableOpacity, ScrollView, Image, Text, TouchableWithoutFeedback } from "react-native";
import { ChevronLeftIcon, HeartIcon, PlayIcon, FilmIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "@/components/Cast";
import Carousel from 'react-native-snap-carousel';
import ReviewCard from "@/components/ReviewCard";
import SerieList from "@/components/SerieList";
import CollapsibleText from "@/components/CollapsibleText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleNotification } from "@/util/usePushNotifications";



const { width, height } = Dimensions.get('window');
// const ios = Platform.OS === "ios";

const SerieScreen = () => {
    const router = useRouter();
    const { tvId } = useRoute().params as { tvId: number };
    const [loading, setLoading] = useState(true);
    const [serieItem, setSerieItem] = useState<SerieDetail>();
    const [isFavorite, setIsFavorite] = useState(false);
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoId, setVideoId] = useState<string>();
    const [serieImages, setSerieImages] = useState<string[]>([]);
    const [credit, setCredit] = useState<Credit>();
    const [seasonNumber, setSeasonNumber] = useState<number>();
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [similarSeries, setSimilarSeries] = useState<Serie[]>([]);


    useEffect(() => {
        getTvShowDetails(tvId).then((data) => {
            setSerieItem(data);
            setSeasonNumber(data.seasons[0].season_number);
            getTvSeasonDetails(tvId, data.seasons[0].season_number).then((data) => {
                setEpisodes(data.episodes);
            });
            getTvSeasonCredits(tvId, data.seasons[0].season_number).then((data) => {
                setCredit(data);
            });
            getTvShowImages(tvId, data.seasons[0].season_number).then((data) => {
                setSerieImages(data);
            });
            getTvShowVideos(tvId, data.seasons[0].season_number).then((data) => {
                if (data.filter((video: { name: string; }) => video.name === "Official Trailer").length !== 0) {
                    setVideoId(data.filter((video: { name: string; }) => video.name === "Official Trailer")[0]?.key);
                }
                else {
                    setVideoId(data.filter((type: { type: string; }) => type.type === "Trailer")[0]?.key);
                }
            });
        });
        getTvShowReviews(tvId).then((data) => {
            setReviews(data);
        });
        getSimilarTvShows(tvId).then((data) => {
            setSimilarSeries(data);
        });
        AsyncStorage.getItem(`@favoriteTvSeries:${tvId}`).then((value) => {
            if (value) {
                setIsFavorite(true);
            }
        });
        setLoading(false);
    }, [tvId]);

    useEffect(() => {
        setEpisodes([]);
        setCredit(undefined);
        setSerieImages([]);
        setVideoId(undefined);
        if (seasonNumber !== undefined) {
            getTvSeasonDetails(tvId, seasonNumber).then((data) => {
                setEpisodes(data.episodes);
            });
            getTvSeasonCredits(tvId, seasonNumber).then((data) => {
                setCredit(data);
            });
            getTvShowImages(tvId, seasonNumber).then((data) => {
                setSerieImages(data);
            });
            getTvShowVideos(tvId, seasonNumber).then((data) => {
                if (data.filter((video: { name: string; }) => video.name === "Official Trailer").length !== 0) {
                    setVideoId(data.filter((video: { name: string; }) => video.name === "Official Trailer")[0]?.key);
                }
                else {
                    setVideoId(data.filter((type: { type: string; }) => type.type === "Trailer")[0]?.key);
                }
            });
        }

    }, [seasonNumber]);

    const handleToggleFavorite = async () => {
        if (isFavorite) {
            await AsyncStorage.removeItem(`@favoriteTvSeries:${tvId}`);
            setIsFavorite(false);
        } else {
            await AsyncStorage.setItem(`@favoriteTvSeries:${tvId}`, JSON.stringify(serieItem));
            await scheduleNotification("Favorite Tv Series", `${serieItem?.name} has been added to your favorites tv series list!`);
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
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="w-full">
                        <View>
                            {serieItem?.backdrop_path ?
                                <Image source={{ uri: serieItem.backdrop_path ? image500(serieItem.backdrop_path) : fallbackMovieImage.uri }} style={{ width: width, height: height * 0.40 }} />
                                :
                                <Image source={{ uri: serieItem?.poster_path ? image500(serieItem.poster_path) : fallbackMovieImage.uri }} style={{ width: width, height: height * 0.40, borderRadius: 24, backgroundColor: "gray" }} />
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
                        <Text className="text-white text-5xl font-bold text-center tracking-wider mt-2">{serieItem?.name}</Text>
                        <Text className="text-neutral-400 -tracking-tighter font-semibold text-xl text-center mt-3">{serieItem?.status} • {serieItem?.first_air_date?.toString().substring(0, 4)} {serieItem?.episode_run_time[0] && "• " + serieItem?.episode_run_time[0] + " min"}</Text>
                        <View style={{ position: 'absolute', top: -50, right: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {videoId && <TouchableOpacity className=" p-2 rounded-3xl"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#eab308" }}
                                onPress={() => setShowVideoModal(true)}
                            >
                                <PlayIcon size={35} color="white" />
                            </TouchableOpacity>}
                        </View>
                        <View style={{ position: 'absolute', top: -50, left: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {serieImages && serieImages.length > 0 && <TouchableOpacity className=" p-2 rounded-3xl"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#eab308" }}
                                onPress={() => setShowImagesModal(true)}
                            >
                                <FilmIcon size={35} color="white" />
                            </TouchableOpacity>}
                        </View>
                        <ModalComp isOpen={showImagesModal} withInput={false}>
                            <ImageModal images={serieImages} setShowImageModal={setShowImagesModal} />
                        </ModalComp>
                        <ModalComp isOpen={showVideoModal} withInput={false}>
                            <VideoModal videoId={videoId} setShowVideoModal={setShowVideoModal} />
                        </ModalComp>
                        <View className="flex-row flex-wrap justify-center mx-4 space-x-2 mt-3">
                            {serieItem?.genres.map((genre, index) => (
                                <Text key={index} className="text-neutral-400 font-semibold text-xl">
                                    {genre.name}{index !== serieItem.genres.length - 1 && " • "}
                                </Text>
                            ))}
                        </View>
                        <View className="my-6 mx-4 space-y-2">
                            <Text className="text-white font-bold text-xl">Overview</Text>
                            <CollapsibleText text={serieItem?.seasons[0].overview ? serieItem.seasons[0].overview : serieItem?.overview === "" ? "No overview available" : serieItem?.overview} />
                        </View>
                        <Text className="text-neutral-400 mx-4 tracking-wider mt-3 text-lg">{ }</Text>
                    </View>
                    {serieItem?.seasons &&
                        <>
                            <Text className="text-white text-3xl font-bold text-center mt-3 mb-3">Seasons</Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                            >
                                {serieItem.seasons && serieItem.seasons.map((season, index) => (
                                    <TouchableWithoutFeedback
                                        key={index}
                                        onPress={() => { setSeasonNumber(season.season_number) }}
                                    >
                                        <View style={{ marginRight: 16, marginTop: 4, alignItems: "center", borderColor: seasonNumber === season.season_number ? "#eab308" : "transparent", borderWidth: 2, borderRadius: 24 }}>
                                            <Image
                                                source={season.poster_path ? { uri: image500(season.poster_path) } : fallbackMovieImage}
                                                style={{ width: width * 0.33, height: height * 0.22, borderRadius: 24, backgroundColor: "gray" }} />
                                            <Text
                                                style={{ fontSize: 18 }}
                                                className="text-white ml-1"
                                            >
                                                {season.name.length > 14 ? season.name.substring(0, 14) + "..." : season.name}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </ScrollView>
                        </>
                    }
                    {episodes.length > 0 &&
                        <>
                            <Text className="text-white text-3xl font-bold text-center mt-3 mb-3">Episodes</Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                            >
                                {episodes.map((episode, index) => (
                                    <TouchableWithoutFeedback
                                        key={index}
                                    >
                                        <View style={{ marginRight: 16, marginTop: 4, alignItems: "center" }}>
                                            <Image
                                                source={episode.still_path ? { uri: image500(episode.still_path) } : fallbackMovieImage}
                                                style={{ width: width * 0.33, height: height * 0.22, borderRadius: 24, backgroundColor: "gray" }} />
                                            <Text
                                                style={{ fontSize: 18 }}
                                                className="text-white ml-1"
                                            >
                                                {episode.name.length > 14 ? episode.name.substring(0, 14) + "..." : episode.name}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                ))}
                            </ScrollView>
                        </>
                    }
                    {credit && credit.cast.length > 0 && <Cast credit={credit} router={router} />}
                    {reviews.length > 0 &&
                        <>
                            <Text className="text-white text-3xl font-bold text-center mt-3 mb-3">Reviews</Text>
                            <Carousel
                                data={reviews}
                                renderItem={({ item }) => (
                                    <ReviewCard name={item.author} avatar={item.author_details.avatar_path ? image185(item.author_details.avatar_path) : fallbackMovieImage.uri} rating={item.author_details.rating} content={item.content} />
                                )}
                                sliderWidth={width}
                                itemWidth={width * 0.8}
                                inactiveSlideScale={0.9}
                                inactiveSlideOpacity={0.3}
                                slideStyle={{}}
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
                    {similarSeries.length > 0 && <SerieList title="Similar Series" hideSeeAll={true} data={similarSeries} />}
                </ScrollView>
            }
        </View>
    );
};

export default SerieScreen;
