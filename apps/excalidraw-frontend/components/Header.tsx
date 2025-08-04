"use client"
import { MenuIcon, Sun } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="py-2 border-b border-gray-200 dark:border-white/15 md:border-none fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center bg-white/70 dark:bg-neutral-950/70 backdrop-blur md:border md:border-gray-200 dark:md:border-white/15 p-2 rounded-lg max-w-5xl mx-auto">
          <div className="p-1.5 rounded-lg border border-gray-200 dark:border-white/15">
            <svg
              fill="#65e6bf"
              className="size-8"
              viewBox="-51.2 -51.2 614.40 614.40"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#65e6bf"
            >
              <path d="M188.8,334.07H386.13L279.47,448H83.2Z"></path>
              <path d="M512,199H106.61L0,313H405.39Z"></path>
              <path d="M232.2,64H428.8L322.62,177.93H125.87Z"></path>
            </svg>
          </div>

          <div className="hidden md:flex">
            <nav className="flex items-center gap-8 text-sm">
              <a href="#" className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition">
                Feature
              </a>
              <a href="#" className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition">
                About Us
              </a>
              <a href="#" className="text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition">
                Pricing
              </a>
            </nav>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600/30 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                // Sun icon for dark mode
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Moon icon for light mode
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
