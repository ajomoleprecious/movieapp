import { View, Text, Platform, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import TrendingMovies from "../../components/TrendingMovies";
import { useEffect, useState } from "react";
import MovieList from "../../components/MovieList";
import { useRouter } from "expo-router";
import LoadingSpinner from "@/components/Loading";
import { getTopRatedMovies, getTrendingMovies, getUpcomingMovies, getTrendingTvShows, getOnAirTvShows, getTopRatedTvShows } from "@/api/db";
import { Movie, Serie } from "@/types";
import TrendingTvSeries from "@/components/TrendingTvSeries";
import SerieList from "@/components/SerieList";
import React from "react";

const ios = Platform.OS === "ios";
type Selection = "movies" | "tv";

const HomeScreen = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<Serie[]>([]);
  const [onAirTVShows, setOnAirTVShows] = useState<Serie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<Serie[]>([]);
  const [selection, setSelection] = useState<Selection>("movies");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      if (selection === "movies") {
        await getTrendingMovies().then((data: Movie[]) => setTrendingMovies(data));
        await getUpcomingMovies().then((data: Movie[]) => setUpcomingMovies(data));
        await getTopRatedMovies().then((data: Movie[]) => setTopRatedMovies(data));
        setLoading(false);
      } else if (selection === "tv") {
        await getTrendingTvShows().then((data: Serie[]) => setTrendingTVShows(data));
        await getOnAirTvShows().then((data: Serie[]) => setOnAirTVShows(data));
        await getTopRatedTvShows().then((data: Serie[]) => setTopRatedTVShows(data));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selection]);

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar style="light" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="px-2 py-1 rounded-full bg-neutral-700"
            onPress={() => setSelection(selection === "movies" ? "tv" : "movies")}
          >
            {selection === "movies" ? (
              <Text className="text-4xl font-bold text-white">
                <Text style={{ color: "#eab308" }}>M</Text>ovies
              </Text>
            ) : (
              <Text className="text-4xl font-bold text-white">
                <Text style={{ color: "#eab308" }}>TV</Text> series
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 rounded-full bg-neutral-700"
            onPress={() => router.push("/(search)")}
          >
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {selection === "movies" ? (
            <>
              {trendingMovies && trendingMovies.length > 0 && (
                <TrendingMovies data={trendingMovies} />
              )}
            </>
          ) : (
            <>
              {trendingTVShows && trendingTVShows.length > 0 && (
                <TrendingTvSeries data={trendingTVShows} />
              )}
            </>
          )}
          {selection === "movies" ? (
            <>
              {upcomingMovies && upcomingMovies.length > 0 && (
                <MovieList title="Upcomming" data={upcomingMovies} />
              )}
              {topRatedMovies && topRatedMovies.length > 0 && (
                <MovieList title="Top Rated" data={topRatedMovies} />
              )}
            </>
          ) : (
            <>
              {onAirTVShows && onAirTVShows.length > 0 && (
                <SerieList title="On Air" data={onAirTVShows} />
              )}
              {topRatedTVShows && topRatedTVShows.length > 0 && (
                <SerieList title="Top Rated" data={topRatedTVShows} />
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
