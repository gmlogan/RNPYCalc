import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import TimeEntry from "../../components/TimeEntry";
import PageHeader from "../../components/PageHeader";

export default function TimeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Time" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TimeEntry onChange={(v) => console.log(v)} />
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
  },
});
