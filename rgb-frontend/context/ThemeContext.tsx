import { createContext, useContext, useState } from "react";
import { themes, ThemeMode } from "../constants/theme";

type ThemeContextType = {
  mode: ThemeMode;
  theme: typeof themes.red;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("red");

  return (
    <ThemeContext.Provider value={{ mode, theme: themes[mode], setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}