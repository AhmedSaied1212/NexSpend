/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. respect saved preference
    const saved = localStorage.getItem("nexspend-theme");
    if (saved) return saved;
    // 2. respect OS preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Keep <html> class in sync
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("nexspend-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const setLight = () => setTheme("light");
  const setDark  = () => setTheme("dark");
  const setSystem = () => {
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(sysDark ? "dark" : "light");
    localStorage.removeItem("nexspend-theme");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLight, setDark, setSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
