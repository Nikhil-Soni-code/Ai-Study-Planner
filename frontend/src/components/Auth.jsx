import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Auth() {
  const { login, signup } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isLogin) {
      emailInputRef.current?.focus();
    } else {
      nameInputRef.current?.focus();
    }
    setError("");
    setFieldErrors({});
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [isLogin]);

  const validateForm = () => {
    const errors = {};
    if (!isLogin && !name.trim()) {
      errors.name = "Full name is required";
    }
    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!isLogin && password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 antialiased selection:bg-blue-100">
      
      {/* Left Section: Branding & Info */}
      <div className="md:w-1/2 bg-white flex flex-col justify-between p-8 md:p-16 border-b md:border-b-0 md:border-r border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">AI Study Planner</span>
        </div>

        <div className="my-auto max-w-md space-y-4 pt-12 pb-8 md:py-0">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Synthesize your study routines with AI.
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            A professional MERN dashboard utilizing Google Gemini to compile schedules, target exam dates, flag weak subjects, and construct personalized study roadmaps.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} AI Study Planner. All rights reserved.
        </div>
      </div>

      {/* Right Section: Form Card */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-sm w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isLogin ? "Sign In" : "Create an Account"}
            </h2>
            <p className="text-xs text-slate-455 mt-1">
              {isLogin ? "Enter your credentials to access your dashboard" : "Register to compile schedules and track syllabi"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            
            {/* Full Name (Signup only) */}
            {!isLogin && (
              <div>
                <label htmlFor="fullname" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  ref={nameInputRef}
                  id="fullname"
                  type="text"
                  required
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 ${
                    fieldErrors.name 
                      ? "border-red-400 focus:ring-red-500/10" 
                      : "border-slate-200 focus:border-blue-500"
                  }`}
                  placeholder="Nikhil Soni"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                  }}
                />
                {fieldErrors.name && (
                  <span className="text-[10px] text-red-500 font-medium mt-1 block">
                    {fieldErrors.name}
                  </span>
                )}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                required
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 ${
                  fieldErrors.email 
                    ? "border-red-400 focus:ring-red-500/10" 
                    : "border-slate-200 focus:border-blue-500"
                }`}
                placeholder="cse23013@glbitm.ac.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
              />
              {fieldErrors.email && (
                <span className="text-[10px] text-red-500 font-medium mt-1 block">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input
                id="password"
                type="password"
                required
                className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 ${
                  fieldErrors.password 
                    ? "border-red-400 focus:ring-red-500/10" 
                    : "border-slate-200 focus:border-blue-500"
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                }}
              />
              {fieldErrors.password && (
                <span className="text-[10px] text-red-500 font-medium mt-1 block">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 ${
                    fieldErrors.confirmPassword 
                      ? "border-red-400 focus:ring-red-500/10" 
                      : "border-slate-200 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: "" });
                  }}
                />
                {fieldErrors.confirmPassword && (
                  <span className="text-[10px] text-red-500 font-medium mt-1 block">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div className="bg-red-50 text-red-650 text-xs font-semibold px-4 py-2.5 rounded-xl border border-red-100 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 transition-all duration-150 cursor-pointer"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  isLogin ? "Sign In" : "Register Account"
                )}
              </button>
            </div>
          </form>

          {/* Toggle link */}
          <div className="text-center mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 focus:outline-none cursor-pointer"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
