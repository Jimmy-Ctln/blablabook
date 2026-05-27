import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "./themeStore";

describe("themeStore", () => {
  beforeEach(() => {
    // Reset to the default theme + clean DOM class between tests
    useThemeStore.setState({ theme: "dark" });
    document.documentElement.classList.remove("light");
  });

  it("toggleTheme switches the theme from 'dark' to 'light' and adds the 'light' class on <html>", () => {
    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("toggleTheme switches back from 'light' to 'dark' and removes the 'light' class on <html>", () => {
    useThemeStore.setState({ theme: "light" });
    document.documentElement.classList.add("light");

    useThemeStore.getState().toggleTheme();

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });
});
