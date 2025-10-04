import React from 'react';
import { motion } from 'framer-motion';
import { Code, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

const Header = ({ currentPage, setCurrentPage, onAuthClick, user, setUser }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'vision', label: 'Vision' },
    { id: 'products', label: 'Products' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <motion.header
      className="glass-effect sticky top-0 z-50 px-6 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
          <div className="p-2 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-lg">
            <Code className="h-6 w-6 text-slate-900" />
          </div>
          <span className="text-xl font-bold gradient-text">IdeaQLabs</span>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === item.id
                  ? 'bg-sky-400 text-slate-900 font-semibold'
                  : 'text-slate-200 hover:text-yellow-400 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Auth Button */}
        {!user ? (
          <Button
            onClick={onAuthClick}
            className="bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold"
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-slate-200 font-medium">
              {user.user_metadata?.full_name || user.email}
            </span>
            <Button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
