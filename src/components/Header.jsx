import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext"; // Ensure your auth context path is correct
import { useNavigate } from "react-router-dom";

const Header = ({ onAuthClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const firstName = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ")[0]
    : user?.email?.split("@")[0];

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/30 border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center space-x-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/logo192.png"
            alt="IdeaQLabs Logo"
            className="w-8 h-8 rounded-full shadow-lg"
          />
          <span className="text-2xl font-bold gradient-text">IdeaQLabs</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-slate-200 text-lg">
          <button
            onClick={() => navigate("/")}
            className="hover:text-white transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/about")}
            className="hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => navigate("/projects")}
            className="hover:text-white transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {user ? (
            // ✅ Signed-in State (desktop)
            <div className="hidden md:flex items-center bg-white/10 px-4 py-2 rounded-lg relative group cursor-pointer">
              <span className="text-white font-medium">{firstName}</span>

              {/* Tooltip for Sign Out */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black/90 text-white text-sm px-4 py-2 rounded-lg shadow-lg border border-white/10 whitespace-nowrap"
              >
                <button
                  onClick={signOut}
                  className="hover:text-red-400 transition-colors"
                >
                  Sign Out
                </button>
              </motion.div>
            </div>
          ) : (
            // ✅ Sign-in button (desktop)
            <Button
              onClick={onAuthClick}
              className="hidden md:flex bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-all rounded-lg px-4 py-2 shadow-md"
            >
              Sign In
            </Button>
          )}

          {/* ✅ Hamburger (always visible on mobile) */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-sky-400 transition-colors"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/70 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-4 text-slate-200 text-lg"
          >
            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => {
                navigate("/projects");
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-white transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => {
                navigate("/contact");
                setMenuOpen(false);
              }}
              className="block w-full text-left hover:text-white transition-colors"
            >
              Contact
            </button>

            <div className="pt-4 border-t border-white/10">
              {user ? (
                <Button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold hover:opacity-90 transition-all rounded-lg"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onAuthClick();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-all rounded-lg"
                >
                  Sign In
                </Button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
