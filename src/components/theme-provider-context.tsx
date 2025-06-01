import { createContext } from "react";
import { Theme } from "./theme-provider";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light", // Default theme
  // Default theme can be "light", "dark", or "system"
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
