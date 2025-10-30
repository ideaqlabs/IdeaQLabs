import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, Share2, Users, HelpCircle } from "lucide-react";

const Earn = () => {
  const [username, setUsername] = useState("");
  const [finalUsername, setFinalUsername] = useState(null);
  const [isMining, setIsMining] = useState(false);
  const [totalMined, setTotalMined] = useState(0);
  const [miningRate, setMiningRate] = useState(10); // base rate
  const [activeReferrals, setActiveReferrals] = useState(5);
  const [totalReferrals, setTotalReferrals] = useState(24);
  const [startTime, setStartTime] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // ---- handle mining start ----
  const handleStartMining = () => {
    if (!isMining) {
      setIsMining(true);
      setVideoPlaying(true);
      setStartTime(Date.now());

      // Auto-stop after 24h
      setTimeout(() => {
        setIsMining(false);
        setVideoPlaying(false);
      }, 24 * 60 * 60 * 1000);
    }
  };

  // ---- simulate mining progress ----
  useEffect(() => {
    if (isMining) {
      const effectiveRate = miningRate * (1 + 0.1 * activeReferrals);
      const interval = setInterval(() => {
        setTotalMined(prev => prev + effectiveRate / 3600); // per second
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMining, activeReferrals]);

  // ---- handle username select once ----
  const handleUsernameSelect = () => {
    if (!finalUsername && username.trim() !== "") {
      setFinalUsername(username.trim());
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUsername);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join me on IdeaQ!",
        text: `Join IdeaQ and start mining with my username: ${finalUsername}`,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 text-center">
      <motion.h1
        className="text-5xl font-bold text-yellow-400 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Start Mining IQU
      </motion.h1>

      {/* Username Section */}
      {!finalUsername ? (
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Choose your unique username"
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            onClick={handleUsernameSelect}
            className="mt-4 bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold w-full"
          >
            Confirm Username
          </Button>
        </div>
      ) : (
        <div className="mb-8 flex justify-center items-center gap-4">
          <div className="text-lg text-white">
            <span className="font-semibold text-yellow-400">Username:</span>{" "}
            {finalUsername}
          </div>
          <Button variant="outline" onClick={handleCopy} size="sm">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleShare} size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mining Section */}
      <div className="max-w-lg mx-auto bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-slate-700 mb-10">
        <div className="mb-6">
          <motion.div
            animate={{ scale: isMining ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: isMining ? Infinity : 0, duration: 1.5 }}
          >
            <Button
              onClick={handleStartMining}
              disabled={isMining}
              className={`w-full text-lg font-semibold py-4 ${
                isMining
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900"
              }`}
            >
              {isMining ? "Mining in Progress..." : "Start Mining"}
            </Button>
          </motion.div>
        </div>

        <div className="text-gray-300 mb-4">
          Mining Rate:{" "}
          <span className="text-yellow-400 font-semibold">
            {miningRate} IQU/hr + {activeReferrals * 10}% bonus
          </span>
        </div>

        <div className="text-gray-300">
          Active Referrals:{" "}
          <span className="text-yellow-400 font-semibold">
            {activeReferrals}/{totalReferrals}
          </span>
        </div>
      </div>

      {/* Mining Status Section */}
      <div className="max-w-md mx-auto text-center mb-10">
        <h2 className="text-2xl font-semibold text-white mb-3">Mining Status</h2>
        <div className="text-5xl font-bold text-yellow-400">
          {totalMined.toFixed(4)} IQU
        </div>
      </div>

      {/* Referral Section */}
      <div className="max-w-lg mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-10">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Your Referral Team
        </h3>
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="h-5 w-5 text-sky-400" />
            <span>
              Active: {activeReferrals}/{totalReferrals}
            </span>
          </div>
          <Button size="sm" variant="outline">
            Ping Inactive
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-left">
        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-yellow-400" /> FAQ
        </h3>

        {[
          "What is IQU?",
          "How do I start mining?",
          "When can I withdraw?",
          "How do referrals work?",
          "What is an active miner?",
          "Can I change my username?",
          "Does mining stop automatically?",
          "How is mining rate decided?",
          "Can I mine on multiple devices?",
          "How do I contact support?",
        ].map((q, i) => (
          <details key={i} className="mb-3 bg-slate-900/40 p-4 rounded-lg">
            <summary className="cursor-pointer text-yellow-400 font-medium">
              {q}
            </summary>
            <p className="text-gray-300 mt-2">
              This answer will explain details related to: {q}.
            </p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Earn;
