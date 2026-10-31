import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Calendar, FileText, Users, ArrowRight } from "lucide-react";
import { loginRequest, registerRequest, persistSession } from "../services/authService";

// Backend roles are "patient" | "doctor" | "admin".
// The rest of the app (App.jsx) still uses "physician" as the display role for doctors,
// so we translate here in one place.
const toUiRole = (backendRole) => (backendRole === "doctor" ? "physician" : backendRole);

// Demo/quick-login buttons ship with these passwords baked in, so they must not
// render in a production build unless explicitly re-enabled via env.
const DEMO_LOGIN_ENABLED =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_LOGIN === "true";

export default function LoginPage({ onLoginSuccess, EliteCareLogo }) {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const validateEmail = (input) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    };
    const extractError = (err) => err?.response?.data?.error || "Something went wrong. Please check your connection to the server and try again.";
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();
        if (!cleanEmail || !cleanPassword) {
            setErrorMsg("Please fill in all fields.");
            return;
        }
        if (!validateEmail(cleanEmail)) {
            setErrorMsg("Please provide a valid email address.");
            return;
        }
        if (cleanPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }
        if (isRegister) {
            if (!fullName.trim()) {
                setErrorMsg("Please enter your full name.");
                return;
            }
            // Determine role dynamically based on email patterns, same convention as before
            let detectedRole = "patient";
            if (cleanEmail.includes("admin")) {
                detectedRole = "admin";
            }
            else if (cleanEmail.includes("doctor") || cleanEmail.includes("physician") || cleanEmail.includes("sarah")) {
                detectedRole = "doctor";
            }
            setIsLoading(true);
            try {
                const { token, user } = await registerRequest({
                    fullName: fullName.trim(),
                    email: cleanEmail,
                    password: cleanPassword,
                    role: detectedRole,
                });
                persistSession(token, user);
                setSuccessMsg("Registration successful! Welcome to the EliteCare family.");
                setTimeout(() => {
                    onLoginSuccess(user.email, user.name, toUiRole(user.role));
                }, 600);
            } catch (err) {
                setErrorMsg(extractError(err));
            } finally {
                setIsLoading(false);
            }
        }
        else {
            setIsLoading(true);
            try {
                const { token, user } = await loginRequest(cleanEmail, cleanPassword);
                persistSession(token, user);
                setSuccessMsg(`Successfully signed in! Welcome back, ${user.name}.`);
                setTimeout(() => {
                    onLoginSuccess(user.email, user.name, toUiRole(user.role));
                }, 600);
            } catch (err) {
                setErrorMsg(extractError(err));
            } finally {
                setIsLoading(false);
            }
        }
    };
    const handleQuickLogin = (role) => {
        setErrorMsg("");
        setSuccessMsg("");
        if (role === "patient") {
            setEmail("john.doe@example.com");
            setPassword("patient123");
            setSuccessMsg("Loaded John Doe (Patient) credentials. Click 'Sign in' to login.");
        }
        else if (role === "physician") {
            setEmail("doctor@elitecare.com");
            setPassword("doctor123");
            setSuccessMsg("Loaded Dr. Sarah Johnson (Physician) credentials. Click 'Sign in' to login.");
        }
        else {
            setEmail("admin@elitecare.com");
            setPassword("admin123");
            setSuccessMsg("Loaded Admin credentials. Click 'Sign in' to login.");
        }
    };
    return (<div className="min-h-[580px] max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 text-left" id="elitecare-login-panel">
      
      {/* LEFT COLUMN: GORGEOUS MEDICAL ILLUSTRATION & FEATURES */}
      <div className="md:col-span-6 bg-gradient-to-br from-green-500/10 via-[#16A34A]/5 to-sky-50/20 p-8 flex flex-col justify-between relative overflow-hidden border-r border-slate-100">
        
        {/* Background Plus/Cross Shapes */}
        <div className="absolute top-10 right-10 text-emerald-400/20 text-7xl select-none font-bold animate-pulse">+</div>
        <div className="absolute bottom-1/3 left-6 text-emerald-400/15 text-5xl select-none font-bold">+</div>
        <div className="absolute top-1/2 right-12 size-16 border-2 border-emerald-400/10 rounded-full"></div>

        <div className="space-y-6 z-10 relative">
          <div className="flex items-center gap-2">
            <EliteCareLogo size={34}/>
            <span className="text-xl font-black tracking-tight flex items-center">
              <span className="text-emerald-700">Elite</span>
              <span className="text-[#16A34A]">Care</span>
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Health,<br />
              <span className="text-[#16A34A]">Our Priority</span>
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-sm">
              Advanced healthcare solution for you and your family. We care about your well-being.
            </p>
          </div>


          {/* Icon Benefits Row */}
          <div className="space-y-4 pt-6 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Users size={15}/>
              </div>
              <span className="text-xs font-semibold text-slate-700">Expert Doctors</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Calendar size={15}/>
              </div>
              <span className="text-xs font-semibold text-slate-700">Easy Appointments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck size={15}/>
              </div>
              <span className="text-xs font-semibold text-slate-700">Secure & Private</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <FileText size={15}/>
              </div>
              <span className="text-xs font-semibold text-slate-700">Digital Reports</span>
            </div>
          </div>
        </div>

        {/* Left Column benefits text footer */}
        <div className="pt-4 text-[10px] text-slate-400 font-medium">
          EliteCare Premium Health Portal. Safe, secure, HIPAA-compliant.
        </div>
      </div>

      {/* RIGHT COLUMN: ELEGANT WELCOME FORM AS IN THE SCHEMA */}
      <div className="md:col-span-6 p-8 flex flex-col justify-between relative overflow-hidden" id="elitecare-login-form-side">

        <div className="my-auto space-y-6 max-w-md mx-auto w-full relative z-10">
          
          <div className="text-center md:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isRegister ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-slate-450">
              {isRegister ? "Register details to continue to your panel" : "Sign in to continue to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field if Register */}
            {isRegister && (<div className="space-y-1">
                <label htmlFor="login-fullname" className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <input id="login-fullname" name="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white text-xs rounded-xl tracking-tight text-slate-800 transition" disabled={isLoading}/>
              </div>)}

            {/* Email Address */}
            <div className="space-y-1">
              <label htmlFor="login-email" className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Email or phone number
              </label>
              <div className="relative">
                <input id="login-email" name="email" type="email" placeholder="Enter your email or phone number" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white text-xs rounded-xl tracking-tight text-slate-800 transition" disabled={isLoading} required/>
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="login-password" className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white text-xs rounded-xl tracking-tight text-slate-800 transition" disabled={isLoading} required/>
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition cursor-pointer">
                  {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>

            {/* Error & Success Notification Banners */}
            {errorMsg && (<div className="p-2 bg-red-50 border border-red-100 text-red-650 rounded-xl text-[11px] font-semibold">
                ⚠️ {errorMsg}
              </div>)}

            {successMsg && (<div className="p-2 bg-green-50 border border-green-100 text-green-700 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 size={13} className="text-[#16A34A]"/>
                {successMsg}
              </div>)}

            {/* Sign in Submission Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[99%] text-white font-extrabold text-xs py-3 rounded-xl transition duration-150 shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer mt-2">
              {isLoading ? (<span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>) : (<>
                  <span>{isRegister ? "Register & Sign Up" : "Sign in"}</span>
                  <ArrowRight size={13}/>
                </>)}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-black tracking-widest my-4">
            <span className="h-[1px] bg-slate-200 w-[30%]"/>
            <span>or continue with</span>
            <span className="h-[1px] bg-slate-200 w-[30%]"/>
          </div>

          {/* Social Sign-in Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => alert("Simulating Google OAuth verification flow...")} className="border border-slate-200 hover:bg-slate-50 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
              <svg className="size-3.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.55 0 2.94.53 4.04 1.58l3.01-3.01C17.21 1.9 14.81 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.59 2.78c.88-2.62 3.32-4.24 6.91-4.24z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.59 2.78c2.1-1.94 3.32-4.8 3.32-8.45z"/>
                <path fill="#FBBC05" d="M5.09 14.78a6.99 6.99 0 0 1 0-4.56L1.5 7.44a11.967 11.967 0 0 0 0 9.12l3.59-2.78z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.59-2.78c-1.1.74-2.5 1.18-4.37 1.18-3.59 0-6.03-1.62-6.91-4.24L1.5 17c1.9 3.85 5.85 6 10.5 6z"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" onClick={() => alert("Simulating Apple OAuth verification flow...")} className="border border-slate-200 hover:bg-slate-50 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer">
              <svg className="size-3.5 fill-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.64.73-1.2 1.87-1.05 2.98 1.12.09 2.26-.57 2.98-1.43z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Don't have an account toggles */}
          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-450 mr-1.5">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button type="button" onClick={() => {
            setIsRegister(!isRegister);
            setErrorMsg("");
            setSuccessMsg("");
        }} className="text-[11px] text-[#16A34A] hover:underline font-extrabold cursor-pointer">
              {isRegister ? "Sign up" : "Sign up"}
            </button>
          </div>

          {/* Quick Access Profiles */}
          {DEMO_LOGIN_ENABLED && (<div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex flex-wrap justify-center gap-1.5">
              <button type="button" onClick={() => handleQuickLogin("patient")} className="text-[10px] bg-slate-100 hover:bg-emerald-50 text-slate-705 hover:text-emerald-800 border border-transparent hover:border-emerald-200 rounded-full px-2.5 py-1 font-bold transition duration-150 cursor-pointer" title="John Doe (Patient) - john.doe@example.com / patient123">
                👤 Patient Panel
              </button>
              <button type="button" onClick={() => handleQuickLogin("physician")} className="text-[10px] bg-slate-100 hover:bg-cyan-50 text-slate-705 hover:text-cyan-800 border border-transparent hover:border-cyan-200 rounded-full px-2.5 py-1 font-bold transition duration-150 cursor-pointer" title="Dr. Sarah Johnson (Physician) - doctor@elitecare.com / doctor123">
                🩺 Doctor Panel
              </button>
              <button type="button" onClick={() => handleQuickLogin("admin")} className="text-[10px] bg-slate-100 hover:bg-amber-50 text-slate-705 hover:text-amber-805 border border-transparent hover:border-amber-200 rounded-full px-2.5 py-1 font-bold transition duration-150 cursor-pointer" title="Administrator - admin@elitecare.com / admin123">
                👤 Admin Panel
              </button>
            </div>
          </div>)}

        </div>
      </div>

    </div>);
}
