import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  Sun,
  Moon,
  Monitor,
  MessageSquare,
  Menu,
  CircleUser,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const { logOut, authUser } = useAuthStore();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  const toggleTheme = (newTheme) => {
    try {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (error) {
      console.error("Failed to change theme:", error);
      setTheme(theme);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="navbar bg-base-200/50 backdrop-blur-sm border-b border-base-300 shadow-md"
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Chatty
            </span>
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="lg:hidden btn btn-ghost btn-circle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {authUser && (
            <>
              <Link to="/" className="btn btn-ghost btn-md">
                <MessageSquare className="size-4" /> Chats
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-md">
                <CircleUser className="w-4 h-4" />
                Profile
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn btn-ghost btn-md text-error hover:bg-error/10"
                disabled={isLoggingOut}
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </motion.button>
            </>
          )}

          {/* Theme Switcher */}
          <div className="dropdown dropdown-end">
            <motion.div
              whileTap={{ rotate: 360 }}
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle btn-md"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : theme === "light" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Monitor className="w-4 h-4" />
              )}
            </motion.div>
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm p-2 shadow-lg bg-base-200 rounded-box w-52 z-999"
            >
              <li>
                <button
                  onClick={() => toggleTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleTheme("cupcake")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" /> Cupcake
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleTheme("synthwave")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" /> Synthwave
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleTheme("coffee")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" /> Coffee
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-16 right-4 bg-base-200 shadow-lg p-4 rounded-lg w-48 z-999"
              onKeyDown={handleKeyPress}
            >
              <div className="flex flex-col gap-2">
                {authUser && (
                  <>
                    <Link
                      to="/profile"
                      className="btn btn-ghost btn-md w-full justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="btn btn-ghost btn-md text-error hover:bg-error/10 w-full justify-start"
                      disabled={isLoggingOut}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="ml-2">
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </span>
                    </motion.button>
                  </>
                )}

                {/* Mobile Theme Switcher */}
                <div className="dropdown dropdown-end w-full">
                  <motion.div
                    whileTap={{ rotate: 360 }}
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-md w-full justify-start"
                  >
                    {theme === "dark" ? (
                      <Moon className="w-4 h-4" />
                    ) : theme === "light" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Monitor className="w-4 h-4" />
                    )}
                    <span className="ml-2">Theme</span>
                  </motion.div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu menu-sm p-2 shadow-lg bg-base-200 rounded-box w-52 z-1000"
                  >
                    <li>
                      <button
                        onClick={() => toggleTheme("light")}
                        className="flex items-center gap-2"
                      >
                        <Sun className="w-4 h-4" /> Light
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => toggleTheme("dark")}
                        className="flex items-center gap-2"
                      >
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => toggleTheme("cupcake")}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="w-4 h-4" /> Cupcake
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => toggleTheme("synthwave")}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="w-4 h-4" /> Synthwave
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => toggleTheme("coffee")}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="w-4 h-4" /> Coffee
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavBar;
