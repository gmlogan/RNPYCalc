import { Stack } from "expo-router";
import { BoatsProvider } from "../store/BoatsContext";

export default function RootLayout() {
  return (
    <BoatsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </BoatsProvider>
  );
}
