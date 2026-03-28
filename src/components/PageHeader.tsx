import { GlassView } from "expo-glass-effect";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  title: string;
}

export default function PageHeader({ title }: Props) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <GlassView glassEffectStyle="regular" style={styles.wrapper}>
        {content}
      </GlassView>
    );
  }

  return <View style={[styles.wrapper, styles.fallback]}>{content}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  bar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.2,
  },
  fallback: {
    backgroundColor: "rgba(242,242,247,0.95)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
});
