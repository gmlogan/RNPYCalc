import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { type TimeValue } from "../utils/time";

const ITEM_HEIGHT = 52;
const VISIBLE = 3;
const PAD = Math.floor(VISIBLE / 2); // 2 padding items top & bottom

// ─── Column picker ────────────────────────────────────────────────────────────

interface ColProps {
  value: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
}

function TimeColumn({ value, max, onChange, label }: ColProps) {
  const scrollRef = useRef<ScrollView>(null);
  const fromScroll = useRef(false);
  const items = Array.from({ length: max + 1 }, (_, i) => i);

  // Scroll to initial position after layout
  useEffect(() => {
    const t = setTimeout(
      () => scrollRef.current?.scrollTo({ y: value * ITEM_HEIGHT, animated: false }),
      80
    );
    return () => clearTimeout(t);
  }, []);

  // Sync wheel when value changes from +/- or text input
  useEffect(() => {
    if (!fromScroll.current) {
      scrollRef.current?.scrollTo({ y: value * ITEM_HEIGHT, animated: false });
    }
    fromScroll.current = false;
  }, [value]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ITEM_HEIGHT);
    const v = Math.max(0, Math.min(max, idx));
    fromScroll.current = true;
    onChange(v);
  };

  const inc = () => onChange(value >= max ? 0 : value + 1);
  const dec = () => onChange(value <= 0 ? max : value - 1);

  return (
    <View style={col.wrap}>
      {/* Increment */}
      <TouchableOpacity onPress={inc} hitSlop={12} style={col.chevronBtn}>
        <SymbolView
          name="chevron.up"
          tintColor="#007AFF"
          style={col.chevron}
          resizeMode="scaleAspectFit"
        />
      </TouchableOpacity>

      {/* Scroll wheel */}
      <View style={[col.picker, { height: ITEM_HEIGHT * VISIBLE }]}>
        {/* Selection highlight bar */}
        <View style={col.highlight} pointerEvents="none" />

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={onScrollEnd}
          contentContainerStyle={{ paddingVertical: PAD * ITEM_HEIGHT }}
        >
          {items.map((n) => (
            <View key={n} style={col.item}>
              <Text style={[col.numText, n === value && col.numSelected]}>
                {String(n).padStart(2, "0")}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Decrement */}
      <TouchableOpacity onPress={dec} hitSlop={12} style={col.chevronBtn}>
        <SymbolView
          name="chevron.down"
          tintColor="#007AFF"
          style={col.chevron}
          resizeMode="scaleAspectFit"
        />
      </TouchableOpacity>

      {/* Label */}
      <Text style={col.label}>{label}</Text>
    </View>
  );
}

// ─── Direct text input ────────────────────────────────────────────────────────

interface FieldProps {
  value: number;
  max: number;
  onChange: (v: number) => void;
}

function DirectField({ value, max, onChange }: FieldProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(null);
    const n = parseInt(text, 10);
    if (!isNaN(n)) onChange(Math.max(0, Math.min(max, n)));
  };

  return (
    <TextInput
      style={direct.input}
      value={draft ?? String(value).padStart(2, "0")}
      onFocus={() => setDraft(String(value).padStart(2, "0"))}
      onChangeText={setDraft}
      onBlur={() => commit(draft ?? "")}
      onSubmitEditing={() => commit(draft ?? "")}
      keyboardType="number-pad"
      maxLength={String(max).length}
      selectTextOnFocus
      returnKeyType="done"
    />
  );
}

// ─── TimeEntry ────────────────────────────────────────────────────────────────

interface Props {
  defaultValue?: TimeValue;
  onChange?: (v: TimeValue) => void;
}

export default function TimeEntry({
  defaultValue = { hours: 0, minutes: 0, seconds: 0 },
  onChange,
}: Props) {
  const [time, setTime] = useState<TimeValue>(defaultValue);

  const update = (field: keyof TimeValue) => (v: number) => {
    const next = { ...time, [field]: v };
    setTime(next);
    onChange?.(next);
  };

  return (
    <View style={entry.card}>
      {/* Scroll wheels + +/- */}
      <View style={entry.wheelsRow}>
        <TimeColumn value={time.hours} max={23} onChange={update("hours")} label="hrs" />
        <Text style={entry.colon}>:</Text>
        <TimeColumn value={time.minutes} max={59} onChange={update("minutes")} label="min" />
        <Text style={entry.colon}>:</Text>
        <TimeColumn value={time.seconds} max={59} onChange={update("seconds")} label="sec" />
      </View>

      <View style={entry.divider} />

      {/* Direct text entry */}
      <View style={entry.directRow}>
        <Text style={entry.directLabel}>Direct entry</Text>
        <View style={entry.directFields}>
          <DirectField value={time.hours} max={23} onChange={update("hours")} />
          <Text style={entry.directColon}>:</Text>
          <DirectField value={time.minutes} max={59} onChange={update("minutes")} />
          <Text style={entry.directColon}>:</Text>
          <DirectField value={time.seconds} max={59} onChange={update("seconds")} />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const col = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  chevronBtn: {
    padding: 6,
  },
  chevron: {
    width: 20,
    height: 20,
  },
  picker: {
    overflow: "hidden",
    width: "100%",
    position: "relative",
  },
  highlight: {
    position: "absolute",
    top: ITEM_HEIGHT * PAD,
    left: 4,
    right: 4,
    height: ITEM_HEIGHT,
    backgroundColor: "rgba(120,120,128,0.12)",
    borderRadius: 10,
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    fontSize: 20,
    fontWeight: "400",
    color: "rgba(0,0,0,0.25)",
    fontVariant: ["tabular-nums"],
  },
  numSelected: {
    fontWeight: "700",
    color: "#000",
  },
  label: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

const direct = StyleSheet.create({
  input: {
    width: 52,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(120,120,128,0.12)",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: "#000",
  },
});

const entry = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    gap: 16,
  },
  wheelsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colon: {
    fontSize: 28,
    fontWeight: "300",
    color: "rgba(0,0,0,0.25)",
    marginBottom: 28, // offset for label below column
    paddingHorizontal: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 4,
  },
  directRow: {
    gap: 10,
  },
  directLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  directFields: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  directColon: {
    fontSize: 20,
    fontWeight: "300",
    color: "rgba(0,0,0,0.4)",
  },
});
