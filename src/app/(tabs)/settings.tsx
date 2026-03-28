import { Stack } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PageHeader from "../../components/PageHeader";
import { type Boat, useBoats } from "../../store/BoatsContext";

// ─── Segmented control ────────────────────────────────────────────────────────

type Mode = "favourites" | "edit";

function SegmentedControl({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <View style={seg.wrap}>
      {(["favourites", "edit"] as Mode[]).map((m) => (
        <TouchableOpacity
          key={m}
          style={[seg.btn, mode === m && seg.active]}
          onPress={() => onChange(m)}
          activeOpacity={0.7}
        >
          <Text style={[seg.label, mode === m && seg.labelActive]}>
            {m === "favourites" ? "Favourites" : "Edit PY"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Favourites row ───────────────────────────────────────────────────────────

function FavRow({ boat, onToggle }: { boat: Boat; onToggle: () => void }) {
  return (
    <View style={row.wrap}>
      <Text style={row.name} numberOfLines={1}>
        {boat.name}
      </Text>
      <Text style={row.py}>{boat.py}</Text>
      <Switch
        value={boat.visible}
        onValueChange={onToggle}
        trackColor={{ true: "#34C759" }}
      />
    </View>
  );
}

// ─── Edit PY row ──────────────────────────────────────────────────────────────

function EditRow({
  boat,
  onUpdate,
}: {
  boat: Boat;
  onUpdate: (py: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(null);
    const n = parseInt(text, 10);
    if (!isNaN(n) && n > 0) onUpdate(n);
  };

  return (
    <View style={row.wrap}>
      <Text style={row.name} numberOfLines={1}>
        {boat.name}
      </Text>
      <TextInput
        style={row.pyInput}
        value={draft ?? String(boat.py)}
        onFocus={() => setDraft(String(boat.py))}
        onChangeText={setDraft}
        onBlur={() => commit(draft ?? "")}
        onSubmitEditing={() => commit(draft ?? "")}
        keyboardType="number-pad"
        maxLength={4}
        selectTextOnFocus
        returnKeyType="done"
      />
    </View>
  );
}

// ─── Settings screen ──────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const [mode, setMode] = useState<Mode>("favourites");
  const { boats, toggleVisibility, reset, updatePY } = useBoats();

  const handleReset = () => {
    Alert.alert(
      "Reset All",
      "Restore all boats to visible and reset PY handicaps to defaults?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: reset },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <PageHeader title="Settings" />

      <View style={styles.controls}>
        <SegmentedControl mode={mode} onChange={setMode} />
        {mode === "favourites" && (
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetLabel}>Reset All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={boats}
        keyExtractor={(b) => b.name}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) =>
          mode === "favourites" ? (
            <FavRow boat={item} onToggle={() => toggleVisibility(item.name)} />
          ) : (
            <EditRow boat={item} onUpdate={(py) => updatePY(item.name, py)} />
          )
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const seg = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: "rgba(120,120,128,0.12)",
    borderRadius: 9,
    padding: 2,
    flex: 1,
  },
  btn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 7,
  },
  active: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6C6C70",
  },
  labelActive: {
    color: "#000",
    fontWeight: "600",
  },
});

const row = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
    marginRight: 12,
  },
  py: {
    fontSize: 15,
    color: "#6C6C70",
    fontVariant: ["tabular-nums"],
    width: 48,
    textAlign: "right",
    marginRight: 12,
  },
  pyInput: {
    width: 64,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(120,120,128,0.12)",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: "#1C1C1E",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
  },
  resetLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginLeft: 16,
  },
  listContent: {
    paddingBottom: 32,
  },
});
