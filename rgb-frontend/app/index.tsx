import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { themes, ThemeMode } from "../constants/theme";

export default function HomeScreen() {
  const { mode, setMode, theme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <Text style={styles.title}>RGB</Text>
      <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
        Pick your mode
      </Text>

      {(Object.keys(themes) as ThemeMode[]).map((key) => (
        <TouchableOpacity
          key={key}
          onPress={() => setMode(key)}
          style={[styles.modeBtn, {
            backgroundColor: themes[key].colors.primary,
            opacity: mode === key ? 1 : 0.5,
          }]}
        >
          <Text style={styles.modeBtnText}>
            {themes[key].emoji} {themes[key].label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => router.push("/input")}
        style={[styles.continueBtn, { borderColor: theme.colors.border }]}
      >
        <Text style={[styles.continueBtnText, { color: "#fff" }]}>
          Continue →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  modeBtn: {
    width: "100%",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  modeBtnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  continueBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    marginTop: 16,
  },
  continueBtnText: {
    fontSize: 18,
    fontWeight: "600",
  },
});