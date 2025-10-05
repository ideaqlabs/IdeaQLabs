import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ currentPage, setCurrentPage, onAuthClick, user, onSignOut }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "vision", label: "Vision" },
    { id: "products", label: "Products" },
    { id: "contact", label: "Contact Us" },
  ];

  // Extract first name safely
  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <motion.header
      className="glass-effect sticky top-0 z-50 px-6 py-4 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setCurrentPage("home")}
        >
          <div className="p-2 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-lg shadow-md">
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

        {/* Auth Button + Mobile Menu */}
        <div className="flex items-center space-x-3">
          {!user ? (
            <Button
              onClick={onAuthClick}
              className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold"
            >
              Sign In
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-yellow-400 flex items-center justify-center text-slate-900 font-semibold shadow-md">
                {firstName[0]?.toUpperCase()}
              </div>
              <span className="text-slate-100 font-medium text-sm sm:text-base">
                {firstName}
              </span>
            </div>
          )}

          {/* Hamburger Icon */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-200 hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="md:hidden mt-4 flex flex-col space-y-2 bg-slate-900/90 p-4 rounded-lg border border-white/10 shadow-lg"
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

            {/* Auth Options in Hamburger */}
            {!user ? (
              <button
                onClick={() => {
                  onAuthClick();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2 mt-2 text-slate-200 bg-gradient-to-r from-sky-500 to-yellow-500 rounded-lg hover:from-sky-600 hover:to-yellow-600 font-semibold"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  onSignOut();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2 mt-2 text-slate-200 bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg hover:from-rose-600 hover:to-amber-600 font-semibold"
              >
                Sign Out
              </button>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
