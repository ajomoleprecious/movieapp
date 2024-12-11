import React, { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CollapsibleTextProps {
    text: string | undefined;
}

const CollapsibleText = ({ text }: CollapsibleTextProps) => {
    const [expanded, setExpanded] = useState(false);

    const paragraphs = text?.split(/\n+/).filter((p) => p.trim().length > 0);

    return (
        <View className="relative">
            <Text className="text-neutral-400 tracking-wide mt-5">
                {expanded ? paragraphs?.join("\n\n") : paragraphs?.[0]}
            </Text>

            {!expanded && paragraphs && paragraphs.length > 1 && (
                <LinearGradient
                    colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]}
                    style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 24 }}
                />
            )}

            {paragraphs && paragraphs.length > 1 && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: 10,
                        }}
                    >
                        <Text className="mt-2 px-2 text-lg rounded-full" style={{backgroundColor: "#eab308"}}>
                            {expanded ? "Read less" : "Read more"}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CollapsibleText;
