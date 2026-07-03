import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { useTheme } from "../context/ThemeContext";

type SearchParams = {
  recipient: string;
  tune: string;
  optional?: string;
};

export default function ResultScreen() {
  const { theme, mode } = useTheme();
  const router = useRouter();
  const { recipient, tune, optional } = useLocalSearchParams<SearchParams>();

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    generateResult();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  async function generateResult() {
    setLoading(true);
    try {
      const response = await fetch(
        "https://rgb-psi.vercel.app/api/create-draft",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            tune,
            recipient,
            optional: optional || "",
          }),
        },
      );
      const data = await response.json();
      setResult(
        data.text || data.message || data.draft || "Something went wrong",
      );
    } catch (error) {
      console.error("Error generating result:", error);
      setResult("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function playAudioFromBackend(textInput: string) {
    if (!textInput || audioLoading) return;
    setAudioLoading(true);

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const response = await fetch(
        "https://rgb-psi.vercel.app/api/generate-audio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput }),
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch audio from server");
        setAudioLoading(false);
        return;
      }

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const dataUrl = reader.result as string;

          const { sound } = await Audio.Sound.createAsync(
            { uri: dataUrl },
            { shouldPlay: true },
          );

          soundRef.current = sound;
        } catch (playError) {
          console.error("Error playing data URI stream:", playError);
        } finally {
          setAudioLoading(false);
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error playing audio:", error);
      setAudioLoading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ color: theme.colors.subtext, fontSize: 16 }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>{theme.emoji} Result</Text>
        <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>
          For {recipient}
        </Text>

        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text style={styles.resultText}>{result}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={generateResult}
          disabled={loading}
          style={[
            styles.regenBtn,
            {
              backgroundColor: theme.colors.primary,
              opacity: loading ? 0.6 : 1,
            },
          ]}
        >
          <Text style={styles.regenBtnText}>Regenerate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => playAudioFromBackend(result)}
          disabled={loading || audioLoading}
          style={[
            styles.regenBtn,
            {
              backgroundColor: theme.colors.primary,
              opacity: loading || audioLoading ? 0.6 : 1,
            },
          ]}
        >
          {audioLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.regenBtnText}>Speak</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/")}
          style={[styles.startOverBtn, { borderColor: theme.colors.border }]}
        >
          <Text style={[styles.startOverText, { color: "#fff" }]}>
            Start Over
          </Text>
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
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  resultCard: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
    minHeight: 120,
    justifyContent: "center",
  },
  resultText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 28,
  },
  regenBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  regenBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  startOverBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  startOverText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
