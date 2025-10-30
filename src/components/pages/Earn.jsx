import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  StopCircle,
  Copy,
  Share2,
  Users,
  Wifi,
  Zap,
  BellOff,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

/**
 * Earn.jsx
 *
 * Mining UI:
 * - Start mining for next 24 hours at baseRate IQU/hr
 * - Shows total coins, video loop (or fallback), Start/Stop UI & disabled while active
 * - Referral team panel with active LED & "Ping Inactive" button
 * - Username display with Copy & Share
 * - FAQ accordion (10 items)
 *
 * Persisted to localStorage per-user (or "guest" if user is null)
 *
 * Props expected from App:
 *   - user (object) optional: if provided, state stored under user.id
 *   - setCurrentPage (function) optional: for navigation
 *
 * Backend integration notes:
 *   - Replace localStorage.getItem/setItem with API calls to your Rust/Supabase backend.
 */

const STORAGE_PREFIX = "ideaqlabs_earn_v1_";
const DEFAULT_BASE_RATE = 2.5; // default IQU per hour (configurable by backend later)
const MINING_SECONDS = 24 * 3600; // 24 hours

const sampleFAQ = [
  {
    q: "What is IQU and IQUE?",
    a: "IQU is the platform's representative currency used for rewards; IQUE is the future minted cryptocurrency. Early platform activity uses IQU.",
  },
  {
    q: "How do I start mining?",
    a: "Create a username in the EARN section and click Start Mining. Mining runs for 24 hours each activation.",
  },
  {
    q: "How is the hourly rate determined?",
    a: "The base mining rate is determined by the platform team and can be updated. Active referrals increase your effective rate by 10% each.",
  },
  {
    q: "How do referrals affect mining?",
    a: "Each active referral adds +10% of the base rate to your effective rate. Example: base 2.5 IQU/hr + 2 active = 2.5 * (1 + 0.2) = 3.0 IQU/hr.",
  },
  {
    q: "What happens when 24 hours ends?",
    a: "Mining stops automatically (video stops). Click Start Mining again to restart for the next 24 hours.",
  },
  {
    q: "Can I mine while offline?",
    a: "Mining continues as a simulated timer in your browser. For production you should use server-side tracking to prevent tampering.",
  },
  {
    q: "How do I share my username?",
    a: "Use the Share button next to your username — it uses the native share API when available, otherwise copies to clipboard.",
  },
  {
    q: "What is Ping Inactive?",
    a: "Ping Inactive sends a reminder notification to referred users who are not actively mining (simulated currently).",
  },
  {
    q: "Is mining fair across users?",
    a: "The platform may update rates and rules; the frontend displays the rate and calculations set by the platform.",
  },
  {
    q: "Where can I see mined coins?",
    a: "Your total mined coins show at the top; later these will be surfaced in your Dashboard with transaction history.",
  },
];

function fmtSeconds(sec) {
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const usePersistedState = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
};

const Earn = ({ user, setCurrentPage }) => {
  // local storage key per-user
  const storageKey = `${STORAGE_PREFIX}${user?.id ?? "guest"}`;

  // persisted state: { coins, username, referrals, mining: { activeUntil }, baseRate }
  const [data, setData] = usePersistedState(storageKey, {
    coins: 0,
    username: null,
    referrals: generateSampleReferrals(),
    mining: { activeUntil: null }, // timestamp in ms
    baseRate: DEFAULT_BASE_RATE,
    lastPing: null,
  });

  const [isMiningActive, setIsMiningActive] = useState(isActiveFromData(data));
  const [secondsLeft, setSecondsLeft] = useState(calcSecondsLeft(data));
  const [effectiveRate, setEffectiveRate] = useState(calcEffectiveRate(data));
  const [showReferralPanel, setShowReferralPanel] = useState(false);
  const [usernameInput, setUsernameInput] = useState(data.username || "");
  const [videoAvailable, setVideoAvailable] = useState(false);
  const countdownRef = useRef(null);
  const videoRef = useRef(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // recompute derived metrics when data changes
  useEffect(() => {
    setIsMiningActive(isActiveFromData(data));
    setSecondsLeft(calcSecondsLeft(data));
    setEffectiveRate(calcEffectiveRate(data));
  }, [data]);

  // ticking interval for mining accrual
  useEffect(() => {
    if (isMiningActive) {
      // update coins each second
      countdownRef.current = setInterval(() => {
        setData((prev) => {
          // compute how many seconds are truly left
          const now = Date.now();
          const until = prev.mining?.activeUntil ?? 0;
          const remaining = Math.max(0, Math.floor((until - now) / 1000));
          // per-second increment:
          const inc = (calcEffectiveRate(prev) || 0) / 3600;
          const nextCoins = +((prev.coins || 0) + inc).toFixed(8); // keep precision
          const nextMining = { ...prev.mining };
          if (remaining <= 0) {
            // mining ended — clear activeUntil
            nextMining.activeUntil = null;
          }
          return { ...prev, coins: nextCoins, mining: nextMining };
        });
      }, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiningActive, storageKey]);

  // update seconds left display at high frequency
  useEffect(() => {
    let timer = null;
    if (isMiningActive) {
      timer = setInterval(() => {
        setSecondsLeft(calcSecondsLeft(data));
      }, 500);
    } else {
      setSecondsLeft(calcSecondsLeft(data));
    }
    return () => clearInterval(timer);
  }, [isMiningActive, data]);

  // attempt to detect video availability (public/mining-loop.mp4)
  useEffect(() => {
    // If there's a video in /public/mining-loop.mp4, it will load; otherwise fallback used.
    fetch("/mining-loop.mp4", { method: "HEAD" })
      .then((r) => {
        if (r.ok) setVideoAvailable(true);
      })
      .catch(() => {
        setVideoAvailable(false);
      });
  }, []);

  // helpers
  function generateUsername(nameCandidate = "user") {
    // lightweight deterministic username generator; backend should enforce uniqueness
    const suffix = Math.floor(Math.random() * 9000 + 1000);
    return `${nameCandidate.replace(/\s+/g, "").toLowerCase()}${suffix}`;
  }

  function handleSetUsername() {
    const trimmed = (usernameInput || "").trim();
    if (!trimmed || trimmed.length < 3) {
      toast({ title: "Choose a username (min 3 chars)." });
      return;
    }
    const next = { ...data, username: trimmed };
    setData(next);
    toast({ title: `Username set: ${trimmed}` });
  }

  function handleStartMining() {
    // require username before starting
    if (!data.username) {
      toast({ title: "Please set a username before starting mining." });
      return;
    }
    if (isMiningActive) {
      toast({ title: "Mining already active." });
      return;
    }
    const now = Date.now();
    const until = now + MINING_SECONDS * 1000;
    setData((prev) => ({ ...prev, mining: { activeUntil: until } }));
    setIsMiningActive(true);
    toast({ title: "Mining started — good luck!" });
  }

  function handleStopMiningManual() {
    // Allow manual stop? The specification said mining stops automatically; we'll provide a stop for user if desired.
    if (!isMiningActive) return;
    setData((prev) => ({ ...prev, mining: { activeUntil: null } }));
    setIsMiningActive(false);
    toast({ title: "Mining stopped." });
  }

  function calcActiveReferrals(d) {
    return (d?.referrals || []).filter((r) => r.active).length;
  }

  function calcEffectiveRate(d) {
    const base = Number(d?.baseRate ?? DEFAULT_BASE_RATE) || DEFAULT_BASE_RATE;
    const actives = calcActiveReferrals(d);
    return +(base * (1 + 0.1 * actives)).toFixed(6);
  }

  function calcSecondsLeft(d) {
    const until = d?.mining?.activeUntil ?? null;
    if (!until) return 0;
    const rem = Math.max(0, Math.floor((until - Date.now()) / 1000));
    return rem;
  }

  function isActiveFromData(d) {
    const until = d?.mining?.activeUntil ?? null;
    if (!until) return false;
    return Date.now() < until;
  }

  // referral functions
  function handleToggleReferral(idx) {
    setData((prev) => {
      const copy = { ...prev };
      copy.referrals = (prev.referrals || []).map((r, i) =>
        i === idx ? { ...r, active: !r.active } : r
      );
      return copy;
    });
  }

  function handlePingInactive() {
    const inactive = (data.referrals || []).filter((r) => !r.active);
    if (!inactive.length) {
      toast({ title: "No inactive referrals to ping." });
      return;
    }
    setData((prev) => ({ ...prev, lastPing: Date.now() }));
    toast({ title: `Pinged ${inactive.length} inactive referral(s).` });
    // Simulated ping: in production send notifications via backend
  }

  function handleCopyUsername() {
    if (!data.username) {
      toast({ title: "No username to copy." });
      return;
    }
    navigator.clipboard
      .writeText(data.username)
      .then(() => toast({ title: "Username copied to clipboard." }))
      .catch(() => toast({ title: "Copy failed." }));
  }

  async function handleShareUsername() {
    if (!data.username) {
      toast({ title: "No username to share." });
      return;
    }
    const shareText = `Join me on IdeaQ! Use my username: ${data.username}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "IdeaQ Referral", text: shareText });
      } catch {
        // user canceled or share failed silently
      }
    } else {
      handleCopyUsername();
      toast({ title: "Share not available — username copied." });
    }
  }

  // small utility to format coin number with commas + rounding
  function displayCoins(n) {
    return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  // referral count formatted (05/24)
  const active = calcActiveReferrals(data);
  const total = (data.referrals || []).length;
  const activeStr = String(active).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  // FAQ handlers
  function toggleFAQ(i) {
    setExpandedFAQ((prev) => (prev === i ? null : i));
  }

  // When mining ends automatically, ensure UI updates quickly
  useEffect(() => {
    if (!isMiningActive && data?.mining?.activeUntil == null) {
      // mining ended; make sure video stops
      try {
        if (videoRef.current && !videoAvailable) {
          // nothing to stop for svg fallback
        } else if (videoRef.current && videoAvailable) {
          videoRef.current.pause();
        }
      } catch {}
    }
  }, [isMiningActive, data.minig, videoAvailable]);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top counter */}
        <motion.div
          className="glass-effect p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-left">
            <div className="text-sm text-slate-300">Total Coins Mined</div>
            <div className="text-3xl md:text-4xl font-bold text-white">
              {displayCoins(data.coins)}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-slate-300 mb-2">Mining Status</div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isMiningActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800/40 text-slate-300"
                }`}
              >
                {isMiningActive ? `Mining — ${fmtSeconds(secondsLeft)}` : "Idle"}
              </div>

              <div className="text-sm text-slate-400">Rate/hr: </div>
              <div className="text-lg font-semibold text-sky-400">
                {effectiveRate} IQU
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-sm text-slate-300">Referrals active</div>
            <div className="text-lg font-semibold text-yellow-400">{`${activeStr}/${totalStr}`}</div>
          </div>
        </motion.div>

        {/* Mining area */}
        <motion.section
          className="glass-effect rounded-3xl p-8 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Video / animation */}
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-700">
                {videoAvailable ? (
                  <video
                    ref={videoRef}
                    src="/mining-loop.mp4"
                    autoPlay={isMiningActive}
                    muted
                    playsInline
                    loop
                    className="w-full h-72 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 flex items-center justify-center bg-gradient-to-br from-slate-900/60 to-slate-800/40">
                    {/* fallback animated SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 120 120"
                      className="w-full h-full"
                    >
                      <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                          <stop offset="0" stopColor="#06b6d4" stopOpacity="0.2" />
                          <stop offset="1" stopColor="#facc15" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                      <rect width="120" height="120" rx="12" fill="url(#g1)" />
                      <g transform="translate(10,20)" className="animate-pulse">
                        <rect x="0" y="40" width="10" height="30" rx="2" fill="#0ea5a4" />
                        <rect x="18" y="30" width="10" height="40" rx="2" fill="#06b6d4" />
                        <rect x="36" y="20" width="10" height="50" rx="2" fill="#f59e0b" />
                        <rect x="54" y="10" width="10" height="60" rx="2" fill="#f97316" />
                        <rect x="72" y="25" width="10" height="45" rx="2" fill="#60a5fa" />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6">
              {/* Username */}
              <div className="glass-effect p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">Your Username</div>
                  <div className="text-lg font-medium text-white">
                    {data.username || <span className="text-slate-500">Not set</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter username..."
                    className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400"
                  />
                  <Button onClick={handleSetUsername} className="px-3 py-2">
                    Save
                  </Button>
                  <button
                    onClick={handleCopyUsername}
                    title="Copy username"
                    className="p-2 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <Copy className="h-4 w-4 text-sky-400" />
                  </button>
                  <button
                    onClick={handleShareUsername}
                    title="Share username"
                    className="p-2 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <Share2 className="h-4 w-4 text-yellow-400" />
                  </button>
                </div>
              </div>

              {/* Mining Button + Rate */}
              <div className="glass-effect p-4 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300">Mining</div>
                    <div className="text-xl font-semibold text-white">{isMiningActive ? "Active" : "Inactive"}</div>
                    <div className="text-sm text-slate-400">{isMiningActive ? "Mining will stop automatically after 24 hours." : "Click Start to mine for 24 hours."}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${isMiningActive ? "text-emerald-300" : "text-slate-400"}`}>Rate</div>
                    <div className="text-2xl font-bold text-sky-400">{effectiveRate} IQU/hr</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleStartMining}
                    disabled={isMiningActive}
                    className={`flex items-center gap-2 px-6 py-3 ${
                      isMiningActive ? "bg-emerald-500/80 text-slate-900" : "bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900"
                    }`}
                  >
                    <Play className="h-5 w-5" />
                    {isMiningActive ? "Mining..." : "Start Mining (24h)"}
                  </Button>

                  <Button
                    onClick={handleStopMiningManual}
                    variant="outline"
                    className="px-4 py-2"
                    disabled={!isMiningActive}
                  >
                    <StopCircle className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                </div>

                <div className="text-sm text-slate-400">
                  Time remaining: <span className="text-white font-semibold">{fmtSeconds(secondsLeft)}</span>
                </div>
              </div>

              {/* Referral info */}
              <div className="glass-effect p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-400" />
                    <div>
                      <div className="text-sm text-slate-300">Referral Team</div>
                      <div className="text-sm text-yellow-400 font-semibold">{`${activeStr}/${totalStr} active`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setShowReferralPanel((s) => !s)} className="px-3 py-2">
                      Referral Team
                    </Button>
                    <Button onClick={handlePingInactive} variant="outline" className="px-3 py-2">
                      Ping Inactive
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {showReferralPanel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="grid gap-3">
                        {(data.referrals || []).map((r, idx) => (
                          <div key={r.username} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${r.active ? "bg-emerald-400" : "bg-slate-600"} border border-slate-700`} />
                              <div>
                                <div className="text-sm font-semibold text-white">{r.name}</div>
                                <div className="text-xs text-slate-400">{r.username}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-slate-400">{r.active ? "Active" : "Inactive"}</div>
                              <button onClick={() => handleToggleReferral(idx)} className="px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200">
                                Toggle
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Additional Info + CTA */}
        <motion.section className="glass-effect p-6 rounded-2xl mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="p-4">
              <div className="text-sm text-slate-300">Base Rate (configurable)</div>
              <div className="text-xl font-semibold text-white">{data.baseRate} IQU/hr</div>
              <div className="text-xs text-slate-400 mt-2">This base rate is set by the platform and can be changed later.</div>
            </div>

            <div className="p-4">
              <div className="text-sm text-slate-300">Effective Rate</div>
              <div className="text-xl font-bold text-sky-400">{effectiveRate} IQU/hr</div>
              <div className="text-xs text-slate-400 mt-2">Includes +10% per active referral.</div>
            </div>

            <div className="p-4 text-right">
              <div className="text-sm text-slate-300">Referrals Last Ping</div>
              <div className="text-md text-white">{data.lastPing ? new Date(data.lastPing).toLocaleString() : "Never"}</div>
              <div className="text-xs text-slate-400 mt-2">Click Ping Inactive to remind inactive members.</div>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section className="p-4 rounded-2xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-white mb-4">FAQs</h2>
          <div className="space-y-3">
            {sampleFAQ.map((item, i) => (
              <div key={i} className="glass-effect p-4 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white font-medium">{item.q}</div>
                    <div className="text-slate-400 text-sm mt-2">
                      <AnimatePresence>
                        {expandedFAQ === i ? (
                          <motion.div
                            key="a"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {item.a}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFAQ(i)}
                    className="p-2 rounded-md bg-slate-800/50 border border-slate-700"
                  >
                    {expandedFAQ === i ? <ChevronUp className="h-4 w-4 text-sky-400" /> : <ChevronDown className="h-4 w-4 text-slate-300" />}
                  </button>
                </div>

                {expandedFAQ !== i && (
                  <div className="text-slate-400 text-sm mt-2 line-clamp-2">{/* leaving collapsed preview empty for clarity */}</div>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Earn;

/* --------------- Helpers & sample data --------------- */

function generateSampleReferrals() {
  // Create 8 sample referrals (some active)
  const names = ["alex", "maria", "john", "sophia", "liam", "olivia", "noah", "emma"];
  return names.map((n, i) => ({
    name: capitalize(n),
    username: `${n}${1000 + i}`,
    active: i % 3 === 0, // some active
  }));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
