import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient"; // adjust path if needed

const UsernameModal = ({ onClose, user, role }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Please enter a username.");
      setLoading(false);
      return;
    }

    // Check if username exists in DB
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.trim())
      .single();

    if (existing) {
      setError("Username already taken. Try another one.");
      setLoading(false);
      return;
    }

    // Update user record
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ username: username.trim(), role })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Success → close modal & redirect
    setLoading(false);
    onClose();
    if (role === "earn") window.location.href = "/mining";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1e293b] rounded-2xl shadow-xl w-[90%] max-w-md p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Create Your Username</h2>
        <p className="text-gray-300 mb-6">
          Choose a unique username for your <span className="font-semibold">{role.toUpperCase()}</span> profile.
          This will be linked to your account permanently.
        </p>

        <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-cyan-400 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UsernameModal;
