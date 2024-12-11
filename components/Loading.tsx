import { Dimensions, View } from "react-native";
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window');
const LoadingSpinner = () => {
    return (
        <View style={{ height: height, width: width * 1, position: "absolute", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <Progress.CircleSnail thickness={12} size={160} color="#eab308" />
        </View>
    );
};

export default LoadingSpinner;