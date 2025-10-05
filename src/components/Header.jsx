import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const Header = ({ currentPage, setCurrentPage, onAuthClick, user, onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pages = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Vision", id: "vision" },
    { name: "Products", id: "products" },
    { name: "Contact", id: "contact" },
  ];

  // Get only the first name
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "User";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/70 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          onClick={() => setCurrentPage("home")}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-yellow-400 cursor-pointer"
        >
          IdeaQLabs
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-slate-300">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`hover:text-sky-400 transition-colors ${
                currentPage === page.id ? "text-sky-400" : ""
              }`}
            >
              {page.name}
            </button>
          ))}
        </nav>

        {/* Auth / Profile Section */}
        <div className="flex items-center space-x-3">
          {!user ? (
            <Button
              onClick={onAuthClick}
              className="bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900 font-semibold hover:from-sky-400 hover:to-yellow-400 transition-all"
            >
              Sign In
            </Button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-slate-800/60 px-3 py-2 rounded-lg hover:bg-slate-700/60 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-yellow-400 flex items-center justify-center text-slate-900 font-semibold">
                  {firstName[0]?.toUpperCase()}
                </div>
                <span className="text-slate-200 font-medium hidden sm:block">{firstName}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-lg py-2 z-50"
                  >
                    <button
                      onClick={() => {
                        onSignOut();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 transition"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-sky-400 transition-colors"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-slate-900/95 border-t border-slate-800"
          >
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setCurrentPage(page.id);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-6 py-4 text-slate-300 hover:bg-slate-800 ${
                  currentPage === page.id ? "text-sky-400" : ""
                }`}
              >
                {page.name}
              </button>
            ))}

            {!user ? (
              <button
                onClick={() => {
                  onAuthClick();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-4 text-slate-300 hover:bg-slate-800 border-t border-slate-700"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  onSignOut();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-4 text-slate-300 hover:bg-slate-800 border-t border-slate-700"
              >
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
