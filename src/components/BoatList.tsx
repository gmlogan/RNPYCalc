import { FlatList, StyleSheet, Text, View } from "react-native";
import { useBoats } from "../store/BoatsContext";

function Header() {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, styles.colName]}>Boat</Text>
      <Text style={[styles.headerCell, styles.colPY]}>PY</Text>
      <Text style={[styles.headerCell, styles.colTime]}>Time</Text>
    </View>
  );
}

export default function BoatList() {
  const { boats } = useBoats();
  const visible = boats.filter((b) => b.visible);

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={[styles.row, index % 2 === 1 && styles.rowAlt]}>
            <Text style={[styles.cell, styles.colName]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.cell, styles.colPY]}>{item.py}</Text>
            <Text style={[styles.cell, styles.colTime]}>{item.time}</Text>
          </View>
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
  cell: {
    fontSize: 15,
    color: "#1C1C1E",
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
    color: "#3C3C43",
  },
  listContent: {
    paddingBottom: 8,
  },
});
