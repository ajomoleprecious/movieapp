import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated, Easing } from "react-native";
import { Audio } from 'expo-av';
import { useRouter } from "expo-router";

const IntroScreen = () => {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#262626',
        },
        logo: {
            width: 180,
            height: 180,
        },
    });

    useEffect(() => {
        const playSound = async () => {
            const { sound } = await Audio.Sound.createAsync(
                require("../assets/sounds/intro.mp3")
            );
            await sound.playAsync();

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        };
        setTimeout(() => {
            playSound();
        }, 1000);

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.ease,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 2.5,
                duration: 2500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start(() => {
            router.replace("./(home)/");
        });
    }, [scaleAnim, router]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/images/logo.png')}
                style={[
                    styles.logo,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            />
        </View>
    );
};

export default IntroScreen;
