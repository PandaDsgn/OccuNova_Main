import React from "react";
import { motion } from "framer-motion";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 
        bg-surface text-textPrimary shadow-md`}
    >
      <nav className="flex justify-between items-center px-8 py-4">
        {/* Make sure 'font-brilliant' is here */}
        <h1 className="text-2xl font-bold tracking-wide text-primaryAccent font-brilliant">
          Occunova
        </h1>

        {/* Right side: About + Theme Toggle */}
        <div className="flex items-center gap-6">
          <a
            href="#about"
            className="relative text-base font-medium group text-textSecondary hover:text-textPrimary"
          >
            About
            <motion.span
              className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primaryAccent group-hover:w-full transition-all duration-300"
              layoutId="underline"
            />
          </a>

          {/* Theme Toggle */}
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleTheme}
              className="hidden"
            />
            <div
              className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                isDarkMode ? "bg-secondaryAccent" : "bg-secondaryAccent"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;