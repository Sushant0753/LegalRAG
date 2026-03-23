"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 z-[15] pl-16 bg-white dark:bg-[#0D1218] bg-dots flex items-center justify-end px-6 gap-3">
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 cursor-pointer"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
      </button>
    </header>
  );
}