import { fallbackpersonImage } from "@/api/db";
import { View, Image, Text, ScrollView } from "react-native";
import * as Progress from "react-native-progress";

interface ReviewCardProps {
    name: string;
    avatar: string;
    rating: number;
    content: string;
}

const ReviewCard = ({ name, avatar, rating, content }: ReviewCardProps) => {
    return (
        <View className="bg-neutral-700 p-4 rounded-xl max-w-xs">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Image
                        source={avatar ? { uri: avatar } : fallbackpersonImage}
                        style={{ width: 40, height: 40, borderRadius: 20 , backgroundColor: "gray"}}
                    />
                    <Text className="text-white ml-2 text-lg font-bold">{name}</Text>
                </View>
                <Progress.Circle
                    thickness={5}
                    size={50}
                    progress={rating / 10}
                    color="#eab308"
                    showsText
                    formatText={() => <Text className="text-white text-lg">{rating}/10</Text>}
                />
            </View>
            <ScrollView className="mt-2" style={{height:150}}>
                <Text className="text-white">{content}</Text>
            </ScrollView>
        </View>
    );
};

export default ReviewCard;
