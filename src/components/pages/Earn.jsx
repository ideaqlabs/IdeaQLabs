// src/components/pages/Earn.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, HelpCircle, Circle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

/**
 * Earn.jsx
 * - Persist username & mining data per-user (keyed by email or id)
 * - Require login to set username or start mining
 * - Mining runs for 24 hours and accrues coins per second
 * - View Team + Ping Inactive with compact labels on mobile
 *
 * Props:
 *   - user (object or null)    // passed from App.jsx
 *   - onAuthClick (fn)         // function to open login modal
 */

const STORAGE_PREFIX = "ideaqlabs_earn_v1_";
const MINING_SECONDS = 24 * 3600;
const DEFAULT_BASE_RATE = 2.5;

function getUserStorageKey(user) {
  // prefer email (human readable) else fallback to id, else guest
  if (!user) return `${STORAGE_PREFIX}guest`;
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
  // storage key (changes when user changes)
  const storageKey = getUserStorageKey(user);

  // persisted state loaded/saved to localStorage per-user
  const [persisted, setPersisted] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // UI state
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameLocked, setUsernameLocked] = useState(persisted?.username ?? null); // final username (non-editable once set)
  // ✅ Continue mining even for logged-out users (guest mode)
  const [isMining, setIsMining] = useState(() => {
    if (persisted?.miningActiveUntil && Date.now() < persisted.miningActiveUntil) {
      return true;
    }
    return false;
  });

  const [totalMined, setTotalMined] = useState(Number(persisted?.coins ?? 0));
  const [baseRate, setBaseRate] = useState(Number(persisted?.baseRate ?? DEFAULT_BASE_RATE));
  const [referrals] = useState(() => persisted?.referrals ?? generateSampleReferrals()); // referrals static for now
  const [viewTeam, setViewTeam] = useState(false);

  const miningTimerRef = useRef(null);
  const secondsLeftRef = useRef(calcSecondsLeft(persisted));
  const [, forceRerender] = useState(0); // tiny rerender helper

  // when `user` changes: load persisted data keyed by user
  useEffect(() => {
    const key = getUserStorageKey(user);
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      setPersisted(parsed);
      setUsernameLocked(parsed?.username ?? null);
      setTotalMined(Number(parsed?.coins ?? 0));
      setBaseRate(Number(parsed?.baseRate ?? DEFAULT_BASE_RATE));
      setIsMining(Boolean(parsed?.miningActiveUntil && Date.now() < parsed.miningActiveUntil));
      secondsLeftRef.current = calcSecondsLeft(parsed);
      // if mining active, ensure interval starts
      // (interval effect below will start/stop)
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // persist whenever persisted object changes
  useEffect(() => {
    try {
      const key = storageKey;
      const toSave = {
        username: usernameLocked ?? persisted?.username ?? null,
        coins: totalMined,
        baseRate,
        miningActiveUntil: persisted?.miningActiveUntil ?? (isMining ? Date.now() + MINING_SECONDS * 1000 : null),
        referrals,
      };
      localStorage.setItem(key, JSON.stringify(toSave));
    } catch {
      // ignore storage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, usernameLocked, totalMined, baseRate, isMining]);

  // mining ticking: add coins per second when mining
  useEffect(() => {
    if (!isMining) {
      if (miningTimerRef.current) {
        clearInterval(miningTimerRef.current);
        miningTimerRef.current = null;
      }
      return;
    }

    // start interval
    if (!miningTimerRef.current) {
      miningTimerRef.current = setInterval(() => {
        // compute effective rate
        const activeCount = referrals.filter((r) => r.active).length;
        const effective = baseRate * (1 + 0.1 * activeCount);
        const increment = effective / 3600; // per second
        setTotalMined((prev) => {
          const next = +(prev + increment).toFixed(8);
          return next;
        });

        // check if mining expired (persisted.miningActiveUntil may be stored)
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : null;
        const until = parsed?.miningActiveUntil ?? (persisted?.miningActiveUntil ?? (isMining ? Date.now() + MINING_SECONDS * 1000 : null));
        if (until && Date.now() >= until) {
          // end mining
          clearInterval(miningTimerRef.current);
          miningTimerRef.current = null;
          setIsMining(false);
          toast({ title: "Mining session finished (24h completed)." });
        }
      }, 1000);
    }

    return () => {
      if (miningTimerRef.current) {
        clearInterval(miningTimerRef.current);
        miningTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMining, storageKey, baseRate, referrals]);

  // small refresher for seconds left display (not shown on top status anymore per your request)
  useEffect(() => {
    const t = setInterval(() => forceRerender((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // helper: robust login detection
  function isLoggedIn() {
    // Accept if user object exists and has an id or email (or user_metadata.email)
    return Boolean(user && (user.id || user.email || (user.user_metadata && (user.user_metadata.email || user.user_metadata.id))));
  }

  function handleConfirmUsername() {
    if (!isLoggedIn()) {
      toast({ title: "Please log in to set your username." });
      onAuthClick?.();
      return;
    }
    if (!usernameInput || usernameInput.trim().length < 3) {
      toast({ title: "Choose a username (min 3 chars)." });
      return;
    }
    if (usernameLocked) {
      toast({ title: "Username already set — it cannot be changed." });
      return;
    }

    const uname = usernameInput.trim();
    setUsernameLocked(uname);

    // persist immediately under user's key
    try {
      const key = getUserStorageKey(user);
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed.username = uname;
      parsed.coins = parsed.coins ?? totalMined;
      parsed.baseRate = parsed.baseRate ?? baseRate;
      parsed.miningActiveUntil = parsed.miningActiveUntil ?? null;
      parsed.referrals = parsed.referrals ?? referrals;
      localStorage.setItem(key, JSON.stringify(parsed));
      toast({ title: `Username "${uname}" saved and linked to account.` });
    } catch {
      toast({ title: "Username saved locally." });
    }
  }

  function handleStartMining() {
    if (!isLoggedIn()) {
      toast({ title: "You must log in first!", description: "Please sign in to start mining." });
      onAuthClick?.();
      return;
    }
    if (!usernameLocked) {
      toast({ title: "Set your username first!", description: "Confirm your username before starting mining." });
      return;
    }
    if (isMining) {
      toast({ title: "Mining already in progress." });
      return;
    }

    // set mining active until now + 24h and persist
    const until = Date.now() + MINING_SECONDS * 1000;
    setIsMining(true);

    try {
      const key = getUserStorageKey(user);
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed.miningActiveUntil = until;
      parsed.coins = parsed.coins ?? totalMined;
      parsed.username = parsed.username ?? usernameLocked;
      parsed.baseRate = parsed.baseRate ?? baseRate;
      parsed.referrals = parsed.referrals ?? referrals;
      localStorage.setItem(key, JSON.stringify(parsed));
    } catch {
      // ignore
    }

    toast({ title: "Mining started — good luck!" });
    // mining interval effect will run automatically
  }

  function handleCopyUsername() {
    if (!usernameLocked) {
      toast({ title: "No username to copy." });
      return;
    }
    navigator.clipboard.writeText(usernameLocked).then(
      () => toast({ title: "Username copied to clipboard." }),
      () => toast({ title: "Copy failed." })
    );
  }

  async function handleShareUsername() {
    if (!usernameLocked) return toast({ title: "Set your username first." });
    const shareText = `Join me on IdeaQ — my username: ${usernameLocked}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "IdeaQ Referral", text: shareText });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(shareText).then(
        () => toast({ title: "Share text copied to clipboard." }),
        () => toast({ title: "Copy failed." })
      );
    }
  }

  function displayCoins(n) {
    return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }

  function calcSecondsLeft(persistedObj) {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : persistedObj;
      const until = parsed?.miningActiveUntil ?? persistedObj?.miningActiveUntil ?? null;
      if (!until) return 0;
      return Math.max(0, Math.floor((until - Date.now()) / 1000));
    } catch {
      return 0;
    }
  }

  // responsive label builder for "View Team" and "Ping Inactive"
  const ViewTeamLabel = () => (
    <>
      <span className="inline-block">View</span>
      <span className="inline-block ml-1 md:ml-2">Team</span>
    </>
  );
  const PingInactiveLabel = () => (
    <>
      <span className="inline-block">Ping</span>
      <span className="inline-block ml-1 md:ml-2">Inactive</span>
    </>
  );

  // ensure mining stops automatically if persisted key expired (safety)
  useEffect(() => {
    if (!isMining) return;
    const key = storageKey;
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    const until = parsed?.miningActiveUntil ?? null;
    if (until && Date.now() >= until) {
      setIsMining(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          Start Mining IQU
        </motion.h1>

        {/* Username area */}
        {!usernameLocked ? (
          <div className="mb-6">
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Choose your unique username (min 3 chars)"
              className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 mb-3"
            />
            <Button onClick={handleConfirmUsername} className="w-full bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900 font-semibold">
              Confirm Username
            </Button>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="text-white font-medium">
              Username: <span className="text-yellow-400 font-semibold">{usernameLocked}</span>
            </div>
            <button onClick={handleCopyUsername} className="p-2 bg-slate-800/50 rounded-md border border-slate-700">
              <Copy className="h-4 w-4 text-sky-400" />
            </button>
            <button onClick={handleShareUsername} className="p-2 bg-slate-800/50 rounded-md border border-slate-700">
              <Share2 className="h-4 w-4 text-yellow-400" />
            </button>
          </div>
        )}

        {/* Mining controls */}
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 mb-6">
          <motion.div animate={{ scale: isMining ? [1, 1.04, 1] : 1 }} transition={{ repeat: isMining ? Infinity : 0, duration: 1.5 }}>
            <Button
              onClick={handleStartMining}
              disabled={isMining}
              className={`w-full py-3 text-lg font-semibold ${isMining ? "bg-emerald-500 cursor-not-allowed" : "bg-gradient-to-r from-sky-500 to-yellow-500 text-slate-900"}`}
            >
              {isMining ? "Mining in Progress..." : "Start Mining (24h)"}
            </Button>
          </motion.div>

          <div className="mt-4 text-slate-300 text-sm">
            Mining Rate: <span className="text-yellow-400 font-semibold">{baseRate} IQU/hr</span> <span className="text-slate-400">(+10% per active referral)</span>
          </div>
        </div>

        {/* Mining status */}
        <div className="mb-6">
          <div className="text-sm text-slate-300 mb-2">Total Coins Mined</div>
          <div className="text-4xl md:text-5xl font-bold text-yellow-400">{displayCoins(totalMined)} IQU</div>
        </div>

        {/* Referral area */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="h-5 w-5 text-sky-400" />
              <div>
                <div className="text-sm">Referral Team</div>
                <div className="text-sm text-yellow-400 font-semibold">{String(referrals.filter(r => r.active).length).padStart(2, "0")}/{String(referrals.length).padStart(2,"0")}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setViewTeam(v => !v)}>
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

/* ----------------- helpers ----------------- */

function generateSampleReferrals() {
  return [
    { name: "Alex", username: "alex1001", active: true },
    { name: "Maria", username: "maria1002", active: false },
    { name: "John", username: "john1003", active: true },
    { name: "Sophia", username: "sophia1004", active: false },
    { name: "Liam", username: "liam1005", active: false },
  ];
}

function displayCoins(n) {
  return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

