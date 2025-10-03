import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ currentPage, setCurrentPage, onAuthClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "vision", label: "Vision" },
    { id: "products", label: "Products" },
    { id: "contact", label: "Contact Us" },
  ];

  return (
    <motion.header
      className="glass-effect sticky top-0 z-50 px-6 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="p-2 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-lg">
            <Code className="h-6 w-6 text-slate-900" />
          </div>
          <span className="text-xl font-bold gradient-text">IdeaQLabs</span>
        </motion.div>

        {/* Desktop Nav */}
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

        {/* Auth Button + Hamburger */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={onAuthClick}
            className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold"
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>

          {/* Mobile Hamburger */}
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
            className="md:hidden mt-4 flex flex-col space-y-2 bg-slate-900/90 p-4 rounded-lg"
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
    </motion.header>
  );
};

export default Header;
