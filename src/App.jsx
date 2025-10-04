import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Home from '@/components/pages/Home';
import About from '@/components/pages/About';
import Vision from '@/components/pages/Vision';
import Products from '@/components/pages/Products';
import Contact from '@/components/pages/Contact';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabaseClient'; // Make sure you have supabaseClient.js

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Track logged-in user

  // Check session and listen for auth state changes
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUser(session.user);
    };
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Clean up listener on unmount
    return () => listener.subscription.unsubscribe();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'vision':
        return <Vision />;
      case 'products':
        return <Products />;
      case 'contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>IdeaQLabs - Innovative Web3.0 Development</title>
        <meta
          name="description"
          content="Leading software company specializing in innovative solutions, cutting-edge products and transformative technology experiences."
        />
      </Helmet>

      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onAuthClick={() => setIsAuthModalOpen(true)}
        user={user} // Pass user to Header
        setUser={setUser} // Optional: pass setter for sign out
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        setUser={setUser} // Allow AuthModal to update user after login
      />

      <Toaster />
    </div>
  );
}

export default App;
