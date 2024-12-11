import { fallbackMovieImage, image500 } from "@/api/db";
import { Movie } from "@/types";
import { Dimensions, Image, TouchableWithoutFeedback } from "react-native";

type MovieCardProps = {
    item: Movie;
    handleClick: () => void;
}
const {width, height} = Dimensions.get('window');

const MovieCard = ({item, handleClick} : MovieCardProps) => {
    return (
        <TouchableWithoutFeedback onPress={handleClick}>
            <Image source={item.poster_path ? {uri: image500(item.poster_path)} : fallbackMovieImage} style={{width: width * 0.6, height: height * 0.4, borderRadius:24}} />
        </TouchableWithoutFeedback>
    );
}

export default MovieCard;