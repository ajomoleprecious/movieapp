import { fallbackpersonImage, image500 } from "@/api/db";
import { Credit } from "@/types";
import { Router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native";

type CastProps = {
    router: Router;
    credit: Credit;
}
const Cast = ({ credit, router }: CastProps) => {

    return (
        <View style={{ marginTop: 16, rowGap: 20 }}>
            <Text style={{ marginBottom: 2, fontWeight: "bold", marginLeft: 16, marginRight: 16, fontSize: 25, lineHeight: 36, color: "white" }}>Top Cast</Text>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15, gap: 20 }}
            >
                {credit && credit.cast.map((actor, index) => {
                    return (
                        <TouchableOpacity key={index} className="mr-4 items-center"
                            onPress={() => router.push(`/(actor)/${actor.id}`)}>
                            <View style={{ overflow: 'hidden', alignItems: 'center', width: 100, height: 100, borderRadius: 100 }}>
                                <Image source={actor?.profile_path ? { uri: image500(actor.profile_path) }: fallbackpersonImage} style={{ width: 100, height: 100, backgroundColor: 'gray' }}
                                />
                            </View>
                            <Text className="text-white text-xs mt-1">
                                {actor.character.length > 10 ? actor.character.substring(0, 14) + "..." : actor.character}
                            </Text>
                            <Text className="text-neutral-400 text-xs mt-2">
                                {actor.original_name.length > 10 ? actor.original_name.substring(0, 14) + "..." : actor.original_name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export default Cast;