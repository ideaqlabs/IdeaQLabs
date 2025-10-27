import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import UsernameModal from "../components/UsernameModal";

const Home = () => {
  const { user } = useAuth();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAction = (role) => {
    if (!user) {
      // Open Auth modal (handled globally, not here)
      const signInButton = document.getElementById("global-auth-trigger");
      if (signInButton) signInButton.click();
      return;
    }

    // If logged in but no username yet → open UsernameModal
    if (!user.username && role === "earn") {
      setSelectedRole(role);
      setShowUsernameModal(true);
      return;
    }

    // If username exists → navigate to section
    switch (role) {
      case "earn":
        window.location.href = "/mining";
        break;
      case "learn":
        window.location.href = "/learn";
        break;
      case "mentor":
        window.location.href = "/mentor";
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-6">
      <motion.h1
        className="text-4xl md:text-6xl font-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to <span className="text-cyan-400">IdeaQLabs</span>
      </motion.h1>

      <motion.p
        className="max-w-2xl text-lg md:text-xl text-gray-300 mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Powering the future of learning and innovation through the{" "}
        <span className="text-cyan-300 font-semibold">IQU Economy</span>.  
        Learn, Teach, and Earn through an ecosystem built to reward curiosity,
        mentorship, and collaboration.
      </motion.p>

      <motion.div
        className="flex flex-col md:flex-row gap-6 md:gap-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        {[
          { label: "EARN", color: "bg-emerald-500", role: "earn" },
          { label: "LEARN", color: "bg-blue-500", role: "learn" },
          { label: "MENTOR", color: "bg-purple-500", role: "mentor" },
        ].map((btn) => (
          <motion.button
            key={btn.role}
            onClick={() => handleAction(btn.role)}
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className={`${btn.color} px-8 py-4 rounded-2xl text-lg md:text-xl font-semibold transition-all shadow-lg hover:shadow-cyan-400/40`}
          >
            {btn.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Username Modal */}
      {showUsernameModal && (
        <UsernameModal
          onClose={() => setShowUsernameModal(false)}
          user={user}
          role={selectedRole}
        />
      )}
    </div>
  );
};

export default Home;
