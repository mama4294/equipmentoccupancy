import { createContext, useContext, useEffect, useState } from "react";
import "./Themes.css";
import { cn } from "@/lib/utils";

export type ColorTheme = "slate" | "blue" | "orange" | "green";

export type ColorOption = {
  name: string;
  value: string;
  hex: string;
};

export const colorOptions: ColorOption[] = [
  { name: "Default", value: "slate", hex: "#E76E50" },
  { name: "Palette", value: "palette", hex: "#289D90" },
  { name: "Sapphire", value: "blue", hex: "#2663ec" },
  //   { name: "Red", value: "red", hex: "#ef4444" },
  //   { name: "Orange", value: "orange", hex: "#f97316" },
  //   { name: "Green", value: "green", hex: "#22c55e" },
  //   { name: "Blue", value: "blue", hex: "#3b82f6" },
  //   { name: "Purple", value: "purple", hex: "#a855f7" },
];

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ColorTheme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "slate",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ColorThemeProvider({
  children,
  defaultTheme = "slate",
  storageKey = "color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ColorTheme>(
    () => (localStorage.getItem(storageKey) as ColorTheme) || defaultTheme
  );

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: ColorTheme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      <div className={cn(theme && `theme-${theme}`)}>{children}</div>
    </ThemeProviderContext.Provider>
  );
}

export const useColorTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
