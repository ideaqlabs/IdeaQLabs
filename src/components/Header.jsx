import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Menu,
  X,
  LogOut,
  UserCircle2,
  Settings,
  HelpCircle,
  LayoutDashboard,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ currentPage, setCurrentPage, onAuthClick, user, onSignOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "earn", label: "Earn" },
    { id: "vision", label: "Learn" },
    { id: "products", label: "Products" },
    { id: "contact", label: "Contact" },
  ];

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User";
  const userEmail = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        className="glass-effect sticky top-0 z-[60] px-6 py-4 backdrop-blur-md bg-slate-900/60 border-b border-slate-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-[70]">
          {/* Logo */}
          <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
            <div className="p-2 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-lg">
              <Code className="h-6 w-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold gradient-text">IdeaQLabs</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-sky-400 text-slate-900 font-semibold"
                    : "text-slate-200 hover:text-yellow-400 hover:bg-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold px-4 py-2 rounded-lg"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    if (!dropdownOpen) setMobileOpen(false); // ✅ close hamburger when avatar menu opens
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center focus:outline-none"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-10 h-10 rounded-full border-2 border-sky-400 hover:border-yellow-400 transition-all"
                    />
                  ) : (
                    <UserCircle2 className="h-10 w-10 text-sky-400 hover:text-yellow-400 transition-colors" />
                  )}
                </motion.button>

                {/* Avatar Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-md 
                                 border border-slate-700 rounded-xl shadow-xl p-3 z-[80]"
                    >
                      <div className="px-3 py-2 border-b border-slate-700">
                        <p className="text-white font-semibold">{userName}</p>
                        <p className="text-slate-400 text-sm truncate">{userEmail}</p>
                      </div>
                      <div className="mt-2 flex flex-col space-y-1">
                        <button className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10">
                          <UserCircle2 className="h-4 w-4 mr-2" /> Profile
                        </button>
                        <button className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10">
                          <Settings className="h-4 w-4 mr-2" /> Settings
                        </button>
                        <button className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10">
                          <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                        </button>
                        <button className="flex items-center px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10">
                          <HelpCircle className="h-4 w-4 mr-2" /> FAQ's
                        </button>
                        <button
                          onClick={onSignOut}
                          className="flex items-center px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger Menu */}
            <button
              className="p-2 rounded-lg text-slate-200 hover:bg-white/10"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                if (!mobileOpen) setDropdownOpen(false); // ✅ close avatar menu when hamburger opens
              }}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile + Desktop Hamburger Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="fixed md:absolute md:right-6 top-[72px] flex flex-col space-y-2 bg-slate-900/95 
                       md:rounded-2xl md:w-[20%] w-full md:border md:border-slate-700 
                       backdrop-blur-md z-[75] p-4 rounded-b-lg shadow-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === item.id
                    ? "bg-sky-400 text-slate-900 font-semibold"
                    : "text-slate-200 hover:text-yellow-400 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

