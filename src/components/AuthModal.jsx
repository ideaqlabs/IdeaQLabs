import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient"; // Make sure this exists

// Add this inside AuthModal.jsx, above your main component
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M533.5 278.4c0-17.3-1.5-34-4.3-50.3H272v95h146.8c-6.3 34-25.6 62.8-54.4 82v68h87.8c51.4-47.4 81.3-117.3 81.3-194.7z"/>
    <path fill="#34A853" d="M272 544.3c73.7 0 135.7-24.5 180.9-66.3l-87.8-68c-24.3 16.3-55.4 26-93.1 26-71.6 0-132.3-48.3-154.1-112.8H27.7v70.9C72.3 476.4 165.8 544.3 272 544.3z"/>
    <path fill="#FBBC05" d="M117.9 323.1c-10.5-31.5-10.5-65.9 0-97.4v-70.9H27.7C-2.8 231 0 331.3 27.7 394l90.2-70.9z"/>
    <path fill="#EA4335" d="M272 107.6c39 0 74 13.5 101.7 39.8l76.2-76.2C407.6 24.8 345.6 0 272 0 165.8 0 72.3 67.9 27.7 172.2l90.2 70.9C139.7 156 200.4 107.6 272 107.6z"/>
  </svg>
);

const AuthModal = ({ isOpen, onClose, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPassword(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords do not match!" });
      return;
    }

    try {
      let authResponse;

      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      } else {
        authResponse = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.name } },
        });
      }

      if (authResponse.error) throw authResponse.error;

      setUser(authResponse.data.user || authResponse.data.session.user);
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
      toast({ title: error.message });
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      toast({ title: error.message });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-effect p-8 rounded-2xl w-full max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-sky-400 focus:outline-none transition-colors"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-slate-900 font-semibold py-3 text-lg hover-glow"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-600"></div>
            <span className="px-4 text-slate-400 text-sm">or</span>
            <div className="flex-1 border-t border-slate-600"></div>
          </div>

          {/* Google Auth */}
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 bg-slate-800/50 border border-slate-600 text-slate-200 hover:bg-white/10 py-3 rounded-lg transition-all"
          >
            <img
              src="/google-icon.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="font-semibold">Continue with Google</span>
          </Button>


          {/* Switch Mode */}
          <div className="text-center mt-6">
            <span className="text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={switchMode}
              className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
