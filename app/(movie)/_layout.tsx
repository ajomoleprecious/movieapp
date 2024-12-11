import { Stack } from "expo-router";

export default function MovieDetailLayout() {
    return (
        <Stack>
            <Stack.Screen name="[movieId]" options={{ headerShown: false }} />
            <Stack.Screen name="upcomming" options={{ headerShown: false }} />
            <Stack.Screen name="toprated" options={{ headerShown: false }} />
        </Stack>
    );
}
