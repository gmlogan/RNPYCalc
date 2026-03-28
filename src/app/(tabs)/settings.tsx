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
import { SymbolView } from "expo-symbols";
import PageHeader from "../../components/PageHeader";
import { type Boat, useBoats } from "../../store/BoatsContext";

// ─── Segmented control ────────────────────────────────────────────────────────

type Mode = "favourites" | "edit" | "reference";

const SEGMENTS: { key: Mode; label: string }[] = [
  { key: "favourites", label: "Favourites" },
  { key: "edit",       label: "Edit PY" },
  { key: "reference",  label: "Reference" },
];

function SegmentedControl({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <View style={seg.wrap}>
      {SEGMENTS.map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[seg.btn, mode === key && seg.active]}
          onPress={() => onChange(key)}
          activeOpacity={0.7}
        >
          <Text style={[seg.label, mode === key && seg.labelActive]}>
            {label}
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
      <Text style={row.name} numberOfLines={1}>{boat.name}</Text>
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

function EditRow({ boat, onUpdate }: { boat: Boat; onUpdate: (py: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(null);
    const n = parseInt(text, 10);
    if (!isNaN(n) && n > 0) onUpdate(n);
  };

  return (
    <View style={row.wrap}>
      <Text style={row.name} numberOfLines={1}>{boat.name}</Text>
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

// ─── Reference row ────────────────────────────────────────────────────────────

function RefRow({
  boat,
  selected,
  onSelect,
}: {
  boat: Boat;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[row.wrap, selected && row.refSelected]}
      onPress={onSelect}
      activeOpacity={0.6}
    >
      <Text style={[row.name, selected && row.refNameSelected]} numberOfLines={1}>
        {boat.name}
      </Text>
      <Text style={row.py}>{boat.py}</Text>
      {selected && (
        <SymbolView
          name="checkmark.circle.fill"
          tintColor="#007AFF"
          style={row.check}
          resizeMode="scaleAspectFit"
        />
      )}
      {!selected && <View style={row.check} />}
    </TouchableOpacity>
  );
}

// ─── Settings screen ──────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const [mode, setMode] = useState<Mode>("favourites");
  const { boats, toggleVisibility, reset, updatePY, referenceBoat, setReferenceBoat } =
    useBoats();

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
            <Text style={styles.resetLabel}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {mode === "reference" && referenceBoat && (
        <View style={styles.refBanner}>
          <Text style={styles.refBannerText}>
            Reference: <Text style={styles.refBannerName}>{referenceBoat}</Text>
          </Text>
        </View>
      )}

      <FlatList
        data={boats}
        keyExtractor={(b) => b.name}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          if (mode === "favourites")
            return <FavRow boat={item} onToggle={() => toggleVisibility(item.name)} />;
          if (mode === "edit")
            return <EditRow boat={item} onUpdate={(py) => updatePY(item.name, py)} />;
          return (
            <RefRow
              boat={item}
              selected={referenceBoat === item.name}
              onSelect={() => setReferenceBoat(item.name)}
            />
          );
        }}
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
    fontSize: 12,
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
  refSelected: {
    backgroundColor: "rgba(0,122,255,0.06)",
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
    marginRight: 12,
  },
  refNameSelected: {
    fontWeight: "600",
    color: "#007AFF",
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
  check: {
    width: 22,
    height: 22,
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
  refBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(0,122,255,0.08)",
    borderRadius: 10,
  },
  refBannerText: {
    fontSize: 14,
    color: "#3C3C43",
  },
  refBannerName: {
    fontWeight: "700",
    color: "#007AFF",
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
