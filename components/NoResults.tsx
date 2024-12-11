import { View, Text, Dimensions, Image } from "react-native";

const { width, height } = Dimensions.get('window');

interface NoResultsProps { 
    text?: string;
}

const NoResults = ({ text }: NoResultsProps) => {
    return (
        <>
            <Text className="text-white font-semibold text-xl text-center">{text || "No results found"}</Text>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={require("../assets/images/movietime.png")}
                    style={{
                        width: width * 0.90,
                        height: height * 0.30,
                        resizeMode: "contain",
                        backgroundColor: "darkgray",
                        borderRadius: 24,
                    }}
                />
            </View>
        </>
    );
};

export default NoResults;