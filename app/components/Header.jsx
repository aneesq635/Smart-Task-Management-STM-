"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Header = ({ hideAuthButtons = false }) => {
  const [theme, setTheme] = useState("light");

  // Load saved theme on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #ccc",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
      className="w-full h-16 px-6 flex items-center justify-between"
    >
      <h1 className="text-xl font-bold">MINDSYNC</h1>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-lg select-none">🌞</span>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span className="text-lg select-none">🌙</span>
        </div>

        {/* Auth buttons */}
        {!hideAuthButtons && (
          <Link
            href="/login"
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              background: "#4f46e5",
              color: "white",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Login / Signup
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

