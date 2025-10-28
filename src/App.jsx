import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Home from "@/components/pages/Home";
import About from "@/components/pages/About";
import Earn from "@/components/pages/Earn";
import Vision from "@/components/pages/Learn";
import Products from "@/components/pages/Products";
import Contact from "@/components/pages/Contact";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabaseClient"; // Make sure this exists

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check current session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setUser(data.session.user);
    };

    fetchSession();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.history.replaceState({}, document.title, "/"); // Remove any #access_token
  };

const renderPage = () => {
  switch (currentPage) {
    case "home":
      return <Home setCurrentPage={setCurrentPage} />;
    case "about":
      return <About />;
    case "vision":
      return <Learn />;
    case "products":
      return <Products />;
    case "contact":
      return <Contact />;
    case "earn":                                     // 🆕 add this
      return <Earn setCurrentPage={setCurrentPage} />; 
    default:
      return <Home setCurrentPage={setCurrentPage} />;
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
        user={user}
        onSignOut={handleSignOut}
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
        setUser={setUser} // Pass setter for AuthModal to update App state
      />

      <Toaster />
    </div>
  );
}

export default App;


