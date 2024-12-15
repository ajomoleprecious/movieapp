import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen name="(movie)" options={{ headerShown: false }} />
      <Stack.Screen name="(tv)" options={{ headerShown: false }} />
      <Stack.Screen name="(actor)" options={{ headerShown: false }} />
      <Stack.Screen name="(search)" options={{ headerShown: false }} />
      <Stack.Screen name="addtestapi" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="[editId]" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}