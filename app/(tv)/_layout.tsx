import { Stack } from "expo-router";

export default function MovieDetailLayout() {
    return (
        <Stack>
            <Stack.Screen name="[tvId]" options={{ headerShown: false }} />
            <Stack.Screen name="onair" options={{ headerShown: false }} />
            <Stack.Screen name="toprated" options={{ headerShown: false }} />
        </Stack>
    );
}
