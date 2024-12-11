import { View, Text, Dimensions } from "react-native";
import { FireIcon } from "react-native-heroicons/solid";
import MovieCard from "./MovieCard";
import Carousel from 'react-native-snap-carousel';
import { useRouter } from 'expo-router';
import { Movie } from "@/types";
import { memo } from "react";


type TrendingMoviesProps = {
  data: Movie[];
};

const { width, height } = Dimensions.get('window');

const TrendingMovies = memo(({ data }: TrendingMoviesProps) => {
  const router = useRouter();

  const handleClick = (movie: Movie) => {
    router.push(`/(movie)/${movie.id}`);
  }

  return (
    <View style={{ marginBottom: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 16, marginBottom: 20 }}>
        <Text className="font-bold" style={{ color: 'white', fontSize: 32 }}>Trending</Text>
        <FireIcon strokeWidth={2} size={25} color="#FF4500" />
      </View>
      <Carousel
        data={data}
        renderItem={({ item }) => <MovieCard item={item} handleClick={() => { handleClick(item) }} />}
        sliderWidth={width}
        itemWidth={width * 0.62}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.3}
        slideStyle={{ display: 'flex', alignItems: 'center' }}
        firstItem={0}
        layout="default"
        vertical={false}
        loop={true}
        autoplay={true}
        autoplayInterval={4000}
        autoplayDelay={0}
        enableSnap={true}
        shouldOptimizeUpdates={true}
        onScroll={() => { }}
      />
    </View>
  );
});

export default TrendingMovies;
