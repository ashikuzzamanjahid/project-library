"use client";

import { useEffect, useSyncExternalStore } from "react";

const THEME_EVENT = "project-library-theme-change";

function currentTheme() {
  if (typeof window === "undefined") return false;
  const saved = window.localStorage.getItem("project-library-theme");
  return saved
    ? saved === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, currentTheme, () => false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem(
      "project-library-theme",
      nextDark ? "dark" : "light",
    );
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-pressed={dark}
    >
      <span aria-hidden="true">{dark ? "☀" : "◐"}</span>
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
