import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>App settings will appear here.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
});
