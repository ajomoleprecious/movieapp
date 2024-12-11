import { View, Text, Dimensions } from "react-native";
import { FireIcon } from "react-native-heroicons/solid";
import Carousel from 'react-native-snap-carousel';
import { useRouter } from 'expo-router';
import {Serie } from "@/types";
import TvSerieCard from "./TvSerieCard";


type TrendingTvSeriesProps = {
  data: Serie[];
};

const {width, height} = Dimensions.get('window');

const TrendingTvSeries = ({ data }: TrendingTvSeriesProps) => {
  const router = useRouter();

  const handleClick = (serie: Serie) => {
    router.push(`/(tv)/${serie.id}`);
  }

  return (
    <View style={{ marginBottom: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 16, marginBottom: 20 }}>
        <Text className="font-bold" style={{ color: 'white', fontSize: 32 }}>Trending</Text>
        <FireIcon strokeWidth={2} size={25} color="#FF4500" />
      </View>
      <Carousel
        data={data}
        renderItem={({ item }) => <TvSerieCard item={item} handleClick={() => {handleClick(item)}} />}
        sliderWidth={width}
        itemWidth={width*0.62}
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
        onScroll={() => {}}
        />
    </View>
  );
};

export default TrendingTvSeries;
