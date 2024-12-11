import { Stack } from "expo-router";

export default function PersonDetailLayout() {
    return (
        <Stack>
            <Stack.Screen name="[castId]" options={{ headerShown: false }} />
        </Stack>
    );
}
