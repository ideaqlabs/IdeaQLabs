import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Home from "@/components/pages/Home";
import About from "@/components/pages/About";
import Earn from "@/components/pages/Earn";
import Learn from "@/components/pages/Learn";
import Mentor from "@/components/pages/Mentor";
import Products from "@/components/pages/Products";
import Contact from "@/components/pages/Contact";
import Dashboard from "@/components/pages/Dashboard";
import Profile from "@/components/pages/Profile";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabaseClient";

function App() {
  // ✅ Restore current page from localStorage on load
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "home"
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Persist page change in localStorage
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // ✅ Check current session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setUser(data.session.user);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ Handle sign out and clear all cached data
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);

    // 🧹 Clear Earn-related local data (username, mining, etc.)
    localStorage.removeItem("username");
    localStorage.removeItem("miningData");
    localStorage.removeItem("referrals");

    // 🧹 Optional: clear everything except currentPage
    const page = localStorage.getItem("currentPage");
    localStorage.clear();
    localStorage.setItem("currentPage", page);

    window.history.replaceState({}, document.title, "/");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            setCurrentPage={setCurrentPage}
            user={user}
            onAuthClick={() => setIsAuthModalOpen(true)}
          />
        );
      case "about":
        return <About />;
      case "earn":
        return (
          <Earn
            setCurrentPage={setCurrentPage}
            user={user}
            onAuthClick={() => setIsAuthModalOpen(true)}
          />
        );
      case "learn":
        return <Learn />;
      case "mentor":
        return <Mentor />;
      case "products":
        return <Products />;
      case "contact":
        return <Contact />;
      case "profile":
        return <Profile user={user} />;
      case "dashboard":
        return user ? <Dashboard /> : <Home setCurrentPage={setCurrentPage} />;
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
        setUser={setUser}
      />

      <Toaster />
    </div>
  );
}

export default App;
