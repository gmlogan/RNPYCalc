import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PageHeader from "../../components/PageHeader";
import TimeEntry from "../../components/TimeEntry";
import { useBoats } from "../../store/BoatsContext";

export default function TimeScreen() {
  const { elapsedTime, setElapsedTime, referenceBoat } = useBoats();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Time" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {referenceBoat ? (
          <Text style={styles.refLabel}>{referenceBoat}</Text>
        ) : (
          <Text style={styles.hintLabel}>Select a reference boat in Settings</Text>
        )}
        <TimeEntry
          defaultValue={elapsedTime}
          onChange={setElapsedTime}
        />
      </ScrollView>
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
    justifyContent: "center",
    gap: 12,
  },
  refLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
  hintLabel: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
});
