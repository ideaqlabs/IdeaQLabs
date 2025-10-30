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

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);

    // 🧹 Clear all Earn-related cached data
    localStorage.removeItem("username");
    localStorage.removeItem("miningData");
    localStorage.removeItem("referrals");

    // 🧹 Clear everything except page memory
    const lastPage = localStorage.getItem("currentPage");
    localStorage.clear();
    localStorage.setItem("currentPage", "home");

    // ✅ Redirect to Home if user was on a protected page
    if (["earn", "dashboard", "profile"].includes(lastPage)) {
      setCurrentPage("home");
    }

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
