import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, HelpCircle, Circle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

const Earn = ({ user, onAuthClick }) => {
  const [username, setUsername] = useState("");
  const [finalUsername, setFinalUsername] = useState(null);
  const [isMining, setIsMining] = useState(false);
  const [totalMined, setTotalMined] = useState(0);
  const [miningRate, setMiningRate] = useState(10); // base rate
  const [activeReferrals, setActiveReferrals] = useState(5);
  const [totalReferrals, setTotalReferrals] = useState(24);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [viewTeam, setViewTeam] = useState(false);
  const [referralTeam, setReferralTeam] = useState([
    { name: "AlphaUser", active: true },
    { name: "BetaUser", active: false },
    { name: "GammaUser", active: true },
    { name: "DeltaUser", active: false },
  ]);

  // ---- Load user data on mount ----
  useEffect(() => {
    if (user?.email) {
      const savedData = JSON.parse(localStorage.getItem(`earnData_${user.email}`));
      if (savedData) {
        setFinalUsername(savedData.username || null);
        setTotalMined(savedData.totalMined || 0);
      }
    }
  }, [user]);

  // ---- Save mining data persistently ----
  useEffect(() => {
    if (user?.email && finalUsername) {
      localStorage.setItem(
        `earnData_${user.email}`,
        JSON.stringify({
          username: finalUsername,
          totalMined,
        })
      );
    }
  }, [user, finalUsername, totalMined]);

  // ---- Mining logic ----
  useEffect(() => {
    if (isMining) {
      const effectiveRate = miningRate * (1 + 0.1 * activeReferrals);
      const interval = setInterval(() => {
        setTotalMined((prev) => prev + effectiveRate / 3600); // per second
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMining, activeReferrals]);

  const handleUsernameSelect = () => {
    if (!user) {
      toast({
        title: "Please log in to set your username.",
      });
      onAuthClick();
      return;
    }
    if (!finalUsername && username.trim() !== "") {
      setFinalUsername(username.trim());
      toast({
        title: "Username confirmed!",
        description: "Your username has been linked to your account.",
      });
    }
  };

  const handleStartMining = () => {
    if (!user) {
      toast({
        title: "You must log in first!",
        description: "Please sign in to start mining.",
      });
      onAuthClick();
      return;
    }
    if (!finalUsername) {
      toast({
        title: "Set a username first!",
        description: "You need to confirm your username before mining.",
      });
      return;
    }

    if (!isMining) {
      setIsMining(true);
      setVideoPlaying(true);
      toast({
        title: "Mining started!",
        description: "You are now mining IQU for the next 24 hours.",
      });

      // Stop mining automatically after 24 hours
      setTimeout(() => {
        setIsMining(false);
        setVideoPlaying(false);
        toast({
          title: "Mining session ended",
          description: "Start again to continue mining.",
        });
      }, 24 * 60 * 60 * 1000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalUsername);
    toast({ title: "Copied!", description: "Username copied to clipboard." });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join me on IdeaQ!",
        text: `Join IdeaQ and start mining with my username: ${finalUsername}`,
        url: window.location.href,
      });
    } else {
      toast({ title: "Sharing not supported on this device." });
    }
  };

  const handlePingInactive = () => {
    toast({
      title: "Ping Sent!",
      description: "Notifications sent to inactive team members.",
    });
  };

  return (
    <div className="min-h-screen py-16 px-6 text-center">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-yellow-400 mb-8"
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

        <div className="text-gray-300 mt-4">
          Mining Rate:{" "}
          <span className="text-yellow-400 font-semibold">
            {miningRate} IQU/hr + {activeReferrals * 10}% bonus
          </span>
        </div>

        <div className="text-gray-300 mt-2">
          Active Referrals:{" "}
          <span className="text-yellow-400 font-semibold">
            {activeReferrals}/{totalReferrals}
          </span>
        </div>
      </div>

      {/* Mining Status */}
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
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setViewTeam(!viewTeam)}>
              {viewTeam ? "Hide Team" : "View Team"}
            </Button>
            <Button size="sm" variant="outline" onClick={handlePingInactive}>
              Ping Inactive
            </Button>
          </div>
        </div>

        {viewTeam && (
          <div className="space-y-2 mt-4 text-left">
            {referralTeam.map((ref, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-900/40 px-4 py-2 rounded-lg"
              >
                <span className="text-white">{ref.name}</span>
                <Circle
                  className={`h-3 w-3 ${
                    ref.active ? "text-green-400" : "text-gray-500"
                  }`}
                  fill={ref.active ? "green" : "gray"}
                />
              </div>
            ))}
          </div>
        )}
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
