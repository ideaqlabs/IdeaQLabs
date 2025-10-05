import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, User, Menu, X, LogOut } from "lucide-react";
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
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "User";

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
          {/* Desktop Auth Section */}
          {!user ? (
            <Button
              onClick={onAuthClick}
              className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold hidden md:flex"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          ) : (
            <div className="hidden md:flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-lg relative group">
              <span className="text-yellow-300 font-semibold">{firstName}</span>

              {/* Sign Out   Button with Animated Tooltip */}
              <div className="relative flex items-center">
                <button
                  onClick={onSignOut}
                  className="p-2 hover:bg-white/10 rounded-full transition relative"
                >
                  <LogOut className="h-5 w-5 text-sky-400 hover:text-yellow-400" />
                </button>

                {/* Custom Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-10 opacity-0 group-hover:opacity-100 pointer-events-none"
                >
                  <div className="glass-effect text-slate-100 text-sm px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md border border-white/10 whitespace-nowrap">
                    Sign Out
                  </div>
                </motion.div>
              </div>
            </div>


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

            {/* Mobile Auth Section */}
            <div className="border-t border-slate-700 mt-3 pt-3">
              {!user ? (
                <button
                  onClick={() => {
                    onAuthClick();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-lg"
                >
                  <User className="h-4 w-4" /> Sign In
                </button>
              ) : (
                <button
                  onClick={() => {
                    onSignOut();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold px-4 py-2 rounded-lg"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
