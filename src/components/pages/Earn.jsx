// src/components/pages/Earn.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const STORAGE_PREFIX = "ideaqlabs_earn_v1_";
const GLOBAL_KEY = `${STORAGE_PREFIX}global`;
const MINING_SECONDS = 24 * 3600;
const DEFAULT_BASE_RATE = 2.5;

function getUserStorageKey(user) {
  if (!user) return GLOBAL_KEY;
  const keyId = user.email ?? user.id ?? user.user_metadata?.email ?? user.user_metadata?.id;
  return `${STORAGE_PREFIX}${keyId ?? "guest"}`;
}

function fmtSeconds(sec) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function Earn({ user, onAuthClick }) {
  const [storageKey, setStorageKey] = useState(() => getUserStorageKey(user));

  // Reload data when user changes
  useEffect(() => {
    setStorageKey(getUserStorageKey(user));
  }, [user]);

  // ---- Load persisted data ----
  const [persisted, setPersisted] = useState(() => loadStoredData(storageKey));
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameLocked, setUsernameLocked] = useState(persisted?.username ?? null);
  const [isMining, setIsMining] = useState(() =>
    Boolean(persisted?.miningActiveUntil && Date.now() < persisted.miningActiveUntil)
  );
  const [baseRate, setBaseRate] = useState(Number(persisted?.baseRate ?? DEFAULT_BASE_RATE));
  const [referrals] = useState(() => persisted?.referrals ?? generateSampleReferrals());
  const [viewTeam, setViewTeam] = useState(false);

  const [displayCoins, setDisplayCoins] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    calcSecondsLeft(persisted?.miningActiveUntil)
  );

  // 🔁 Load stored data whenever user changes
  useEffect(() => {
    const saved = loadStoredData(storageKey);
    if (saved) {
      setPersisted(saved);
      setUsernameLocked(saved.username ?? null);
      setIsMining(Boolean(saved.miningActiveUntil && Date.now() < saved.miningActiveUntil));
    }
  }, [storageKey]);

  // ♻️ Update mining progress dynamically (time-based)
  useEffect(() => {
    const updateMiningProgress = () => {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : persisted;
      if (!parsed?.miningStartTime || !parsed?.miningActiveUntil) return;

      const now = Date.now();
      const elapsedSec = Math.min((now - parsed.miningStartTime) / 1000, MINING_SECONDS);
      const activeReferrals = parsed?.referrals?.filter((r) => r.active).length || 0;
      const effectiveRate = (parsed?.baseRate ?? baseRate) * (1 + 0.1 * activeReferrals);
      const mined = (effectiveRate * elapsedSec) / 3600;

      setDisplayCoins(Number(mined.toFixed(8)));
      setSecondsLeft(calcSecondsLeft(parsed.miningActiveUntil));

      if (now >= parsed.miningActiveUntil) setIsMining(false);
    };

    updateMiningProgress();
    const interval = setInterval(updateMiningProgress, 1000);
    return () => clearInterval(interval);
  }, [storageKey, baseRate, referrals, persisted]);

  // 💾 Persist every relevant change (also keep a global backup)
  useEffect(() => {
    const toSave = {
      username: usernameLocked ?? persisted?.username ?? null,
      baseRate,
      miningStartTime: persisted?.miningStartTime,
      miningActiveUntil: persisted?.miningActiveUntil,
      referrals,
    };
    saveToStorage(storageKey, toSave);
    saveToStorage(GLOBAL_KEY, toSave); // backup globally too
  }, [storageKey, usernameLocked, baseRate, referrals, persisted]);

  // --- Handlers ---
  function isLoggedIn() {
    return Boolean(user && (user.id || user.email || user.user_metadata?.email));
  }

  function handleConfirmUsername() {
    const uname = usernameInput.trim();
    if (!uname || uname.length < 3) {
      toast({ title: "Choose a username (min 3 chars)." });
      return;
    }
    setUsernameLocked(uname);
    persistUsername(uname);
    toast({ title: `Username "${uname}" saved.` });
  }

  function persistUsername(uname) {
    const key = getUserStorageKey(user);
    const current = loadStoredData(key) || {};
    const updated = { ...current, username: uname };
    saveToStorage(key, updated);
    saveToStorage(GLOBAL_KEY, updated);
    setPersisted(updated);
  }

  function handleStartMining() {
    if (!usernameLocked) return toast({ title: "Set your username first." });
    if (isMining) return toast({ title: "Mining already active." });

    const now = Date.now();
    const until = now + MINING_SECONDS * 1000;
    const newData = {
      username: usernameLocked,
      baseRate,
      referrals,
      miningStartTime: now,
      miningActiveUntil: until,
    };
    saveToStorage(storageKey, newData);
    saveToStorage(GLOBAL_KEY, newData);
    setPersisted(newData);
    setIsMining(true);
    toast({ title: "Mining started — 24h countdown begun!" });
  }

  function handleCopyUsername() {
    if (!usernameLocked) return toast({ title: "No username to copy." });
    navigator.clipboard.writeText(usernameLocked);
    toast({ title: "Username copied!" });
  }

  async function handleShareUsername() {
    if (!usernameLocked) return toast({ title: "Set username first." });
    const text = `Join me on IdeaQ — my username: ${usernameLocked}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "IdeaQ Referral", text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: "Share text copied." });
    }
  }

  // small handler (was referenced but missing)
  function handlePingInactive() {
    toast({ title: "Ping sent to inactive members (simulated)." });
  }

  // ----- compute effective mining rate here (safe for build) -----
  const activeReferralsCount = referrals.filter((r) => r.active).length;
  const effectiveRateNumber = baseRate * (1 + 0.1 * activeReferralsCount);
  const effectiveRateDisplay = effectiveRateNumber.toFixed(3);

  // --- UI ---
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          IQU Mining
        </motion.h1>

        {/* Username Section */}
        {!usernameLocked ? (
          <div className="mb-6">
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Choose your unique username (min 3 chars)"
              className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 mb-3"
            />
            <Button
              onClick={handleConfirmUsername}
              className="w-full bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900 font-semibold"
            >
              Confirm Username
            </Button>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="text-white font-medium">
              Username:{" "}
              <span className="text-yellow-400 font-semibold">{usernameLocked}</span>
            </div>
            <button
              onClick={handleCopyUsername}
              className="p-2 bg-slate-800/50 rounded-md border border-slate-700"
            >
              <Copy className="h-4 w-4 text-sky-400" />
            </button>
            <button
              onClick={handleShareUsername}
              className="p-2 bg-slate-800/50 rounded-md border border-slate-700"
            >
              <Share2 className="h-4 w-4 text-yellow-400" />
            </button>
          </div>
        )}

        {/* Mining Section */}
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 mb-6">
          <motion.div
            animate={{ scale: isMining ? [1, 1.04, 1] : 1 }}
            transition={{ repeat: isMining ? Infinity : 0, duration: 1.5 }}
          >
            <Button
              onClick={handleStartMining}
              disabled={isMining}
              className={`w-full py-3 text-lg font-semibold ${
                isMining
                  ? "bg-emerald-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900"
              }`}
            >
              {isMining ? "Mining in Progress..." : "Start Mining (24h)"}
            </Button>
          </motion.div>

          {/* Effective Mining Rate Display (render with full calculation) */}
          <div className="mt-4 text-slate-300 text-sm">
            <div>
              Mining Rate:{" "}
              <span className="text-yellow-400 font-semibold">
                {effectiveRateDisplay} IQU/hr
              </span>
            </div>

            <div className="text-slate-500 text-xs mt-1 italic">
              (Base Mining Rate:{" "}
              <span className="text-slate-400">{baseRate.toFixed(2)} IQU/hr</span>)
              {"  +  "}
              Active Referral Boost{" "}
              <span className="text-slate-400">
                (10% ×{" "}
                <span className="text-yellow-300 font-semibold">
                  {activeReferralsCount}
                </span>{" "}
                ={" "}
                <span className="text-yellow-300 font-semibold">
                  {(baseRate * 0.1 * activeReferralsCount).toFixed(2)} IQU/hr
                </span>
                )
              </span>
            </div>
          </div>

        {/* Mining Status */}
        <div className="mb-6">
          <div className="text-sm text-slate-300 mb-2">Total Coins Mined</div>
          <div className="text-4xl md:text-5xl font-bold text-yellow-400">
            {displayCoins.toLocaleString(undefined, { maximumFractionDigits: 6 })} IQU
          </div>
          {isMining && (
            <div className="mt-3 text-slate-400 text-lg font-mono">
              Time Left:{" "}
              <span className="text-yellow-300">{fmtSeconds(secondsLeft)}</span>
            </div>
          )}
        </div>

        {/* Referral area */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="h-5 w-5 text-sky-400" />
              <div>
                <div className="text-sm">Referral Team</div>
                <div className="text-sm text-yellow-400 font-semibold">
                  {String(referrals.filter((r) => r.active).length).padStart(2, "0")}/
                  {String(referrals.length).padStart(2, "0")}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setViewTeam((v) => !v)}>
                <span className="block"><span className="inline">View</span><span className="inline ml-1 md:ml-2">Team</span></span>
              </Button>
              <Button size="sm" variant="outline" onClick={() => { handlePingInactive(); }} >
                <span className="block"><span className="inline">Ping</span><span className="inline ml-1 md:ml-2">Inactive</span></span>
              </Button>
            </div>
          </div>

          {viewTeam && (
            <div className="mt-3 space-y-2 text-left">
              {referrals.map((r, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-md">
                  <div>
                    <div className="text-white font-medium">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.username}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${r.active ? "bg-emerald-400" : "bg-slate-600"} border border-slate-700`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-left">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">FAQ</h3>
          </div>

          {[
            { q: "What is IQU?", a: "IQU is a platform currency used for rewards." },
            { q: "How do I start mining?", a: "Set username (once) and click Start Mining (requires login)." },
            { q: "When does mining stop?", a: "Mining stops automatically after 24 hours." },
            { q: "How do referrals help?", a: "Each active referral adds +10% to base rate." },
            { q: "Can I change my username?", a: "No — username is permanent once confirmed." },
            { q: "Is mining tracked server-side?", a: "Not yet. We'll add server tracking later." },
            { q: "Can I mine on multiple devices?", a: "No, Mining is per-account and session-based." },
            { q: "How do I see history?", a: "Dashboard page will show transaction history soon." },
            { q: "How to contact support?", a: "Use the support / contact page." },
            { q: "Is IQU tradable?", a: "Currently it's a platform currency; later we will mint IQU." },
          ].map((f, idx) => (
            <details key={idx} className="mb-2 bg-slate-900/40 p-3 rounded-md">
              <summary className="cursor-pointer text-yellow-400 font-medium">{f.q}</summary>
              <p className="text-slate-300 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

// 🔧 Helper functions
function loadStoredData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function generateSampleReferrals() {
  return [
    { name: "Alex", username: "alex1001", active: true },
    { name: "Maria", username: "maria1002", active: false },
    { name: "John", username: "john1003", active: true },
    { name: "Sophia", username: "sophia1004", active: false },
    { name: "Liam", username: "liam1005", active: false },
  ];
}

function calcSecondsLeft(until) {
  if (!until) return 0;
  return Math.max(0, Math.floor((until - Date.now()) / 1000));
}

