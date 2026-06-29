import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const tunes = ["default", "pidgin", "dumb", "fluent"];

export default function InputScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [tune, setTune] = useState("default");
  const [optional, setOptional] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: theme.colors.subtext, fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: "#fff" }]}>
          Who&apos;s the target? {theme.emoji}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
          Tell us a bit about them
        </Text>

        <Text style={[styles.label, { color: "#fff" }]}>Name *</Text>
        <TextInput
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Enter their name"
          placeholderTextColor="#888"
          style={[styles.input, {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: "#fff",
          }]}
        />

        <Text style={[styles.label, { color: "#fff" }]}>Tune</Text>
        <View style={styles.tuneRow}>
          {tunes.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTune(t)}
              style={[styles.tuneBtn, {
                borderColor: theme.colors.border,
                backgroundColor: tune === t ? theme.colors.primary : theme.colors.card,
              }]}
            >
              <Text style={{ color: "#fff", textTransform: "capitalize" }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: "#fff" }]}>Extra info (optional)</Text>
        <TextInput
          value={optional}
          onChangeText={setOptional}
          placeholder="Anything else about them?"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
          style={[styles.input, styles.textArea, {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            color: "#fff",
          }]}
        />

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/result",
              params: { recipient, tune, optional },
            })
          }
          disabled={!recipient}
          style={[styles.generateBtn, {
            backgroundColor: theme.colors.primary,
            opacity: !recipient ? 0.4 : 1,
          }]}
        >
          <Text style={styles.generateText}>Generate 🚀</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  tuneRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tuneBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  generateBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  generateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});