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
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "home"
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Persist current page
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // Check active session
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

  // ✅ Handle Sign Out — preserve mining data
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);

    // Save current page
    const page = localStorage.getItem("currentPage");

    // Preserve all Earn-related mining data keys
    const allKeys = { ...localStorage };
    const miningKeys = Object.keys(allKeys).filter((k) =>
      k.startsWith("ideaqlabs_earn_v1_")
    );

    const preservedData = {};
    miningKeys.forEach((k) => {
      preservedData[k] = localStorage.getItem(k);
    });

    // Clear everything else
    localStorage.clear();

    // Restore mining data and current page
    miningKeys.forEach((k) => {
      localStorage.setItem(k, preservedData[k]);
    });
    if (page) localStorage.setItem("currentPage", page);

    // Redirect to home
    setCurrentPage("home");
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
