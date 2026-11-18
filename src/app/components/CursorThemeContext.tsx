"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CursorThemeColor = "#261f76" | "#ff7a00" | "#1f763d";

interface CursorThemeContextType {
  color: CursorThemeColor;
  setColor: (color: CursorThemeColor) => void;
  disableInteractionColors: boolean;
  setDisableInteractionColors: (value: boolean) => void;
}

const CursorThemeContext = createContext<CursorThemeContextType>({
  color: "#261f76",
  setColor: () => {},
  disableInteractionColors: false,
  setDisableInteractionColors: () => {},
});

export function CursorThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<CursorThemeColor>("#261f76");
  const [disableInteractionColors, setDisableInteractionColors] = useState(false);

  return (
    <CursorThemeContext.Provider
      value={{ color, setColor, disableInteractionColors, setDisableInteractionColors }}
    >
      {children}
    </CursorThemeContext.Provider>
  );
}

export function useCursorTheme() {
  return useContext(CursorThemeContext);
}
