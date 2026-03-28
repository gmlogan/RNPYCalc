import { FlatList, StyleSheet, Text, View } from "react-native";
import { useBoats } from "../store/BoatsContext";
import { formatTime, fromSeconds, toSeconds } from "../utils/time";

function ListHeader({ isLive }: { isLive: boolean }) {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.colName]}>Boat</Text>
      <Text style={[styles.headerCell, styles.colPY]}>PY</Text>
      <Text style={[styles.headerCell, styles.colTime]}>
        {isLive ? "Target" : "Time"}
      </Text>
    </View>
  );
}

function BoatRow({
  name, py, timeStr, isRef = false, alt = false,
}: {
  name: string; py: number; timeStr: string; isRef?: boolean; alt?: boolean;
}) {
  return (
    <View style={[styles.row, alt && styles.rowAlt, isRef && styles.rowRef]}>
      <Text style={[styles.cell, styles.colName, isRef && styles.cellRef]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.cell, styles.colPY, isRef && styles.cellRef]}>{py}</Text>
      <Text style={[styles.cell, styles.colTime, isRef && styles.cellRef]}>{timeStr}</Text>
    </View>
  );
}

export default function BoatList() {
  const { boats, referenceBoat, elapsedTime } = useBoats();

  const elapsedSecs = toSeconds(elapsedTime);
  const refBoat = referenceBoat ? boats.find((b) => b.name === referenceBoat) : null;
  const isLive = !!refBoat;

  const others = boats
    .filter((b) => b.visible && b.name !== referenceBoat)
    .map((b) => ({
      ...b,
      targetSecs: isLive ? elapsedSecs * (b.py / refBoat!.py) : 0,
    }))
    .sort((a, b) => (isLive ? a.targetSecs - b.targetSecs : 0));

  const refTimeStr = isLive
    ? formatTime(fromSeconds(elapsedSecs))
    : (refBoat?.time ?? "");

  return (
    <View style={styles.container}>
      <ListHeader isLive={isLive} />

      {/* Sticky reference boat */}
      {refBoat && (
        <>
          <BoatRow
            name={refBoat.name}
            py={refBoat.py}
            timeStr={refTimeStr}
            isRef
          />
          <View style={styles.refDivider} />
        </>
      )}

      <FlatList
        data={others}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <BoatRow
            name={item.name}
            py={item.py}
            timeStr={isLive ? formatTime(fromSeconds(item.targetSecs)) : item.time}
            alt={index % 2 === 1}
          />
        )}
      />
    </View>
  );
}

const COL_PY = 52;
const COL_TIME = 88;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#F2F2F7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  headerCell: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C6C70",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  rowAlt: {
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  rowRef: {
    backgroundColor: "rgba(0,122,255,0.08)",
  },
  refDivider: {
    height: 3,
    backgroundColor: "rgba(0,122,255,0.15)",
  },
  cell: {
    fontSize: 15,
    color: "#1C1C1E",
  },
  cellRef: {
    fontWeight: "600",
    color: "#007AFF",
  },
  colName: {
    flex: 1,
    marginRight: 8,
  },
  colPY: {
    width: COL_PY,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
    marginRight: 8,
  },
  colTime: {
    width: COL_TIME,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  listContent: {
    paddingBottom: 8,
  },
});
