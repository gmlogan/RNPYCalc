import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import BoatList from "../../components/BoatList";
import PageHeader from "../../components/PageHeader";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Home" />
      <View style={styles.content}>
        <BoatList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
