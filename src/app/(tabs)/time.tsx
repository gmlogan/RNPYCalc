import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import TimeEntry from "../../components/TimeEntry";

export default function TimeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Time" }} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TimeEntry onChange={(v) => console.log(v)} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
});
