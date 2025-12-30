"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Welcome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("user_name");
    const storedEmail = localStorage.getItem("user_email");
    
    if (storedName || storedEmail) {
      setUser({ name: storedName || storedEmail });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.refresh(); 
  };

  const handleAddProject = () => {
    if (!user) {
      alert("Please login first to create a new project.");
      router.push("/login");
    } else {
      router.push("/github");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md"> 
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                 <span className="font-bold text-white text-sm">DE</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-wide">
              DevOps-Insight-Engine
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <span className="text-sm text-zinc-400">
                    Welcome, <span className="text-white font-medium">{user.name}</span>
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="text-zinc-400 hover:text-white font-medium transition text-sm"
                  >
                    Log Out
                  </button>
                  <Link href="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/20">
                      Dashboard
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-zinc-400 hover:text-white font-medium transition text-sm">
                    Log In
                  </Link>
                  <Link href="/signup">
                    <button className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 mb-6">
             <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
             v2.0 Now Live with AI Auto-Scaling
          </div>
          <h2 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-7xl">
            <span className="block">Automate your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              CI/CD & Monitoring
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-zinc-400 md:text-xl leading-relaxed">
            Streamline your deployment pipeline with AI-driven insights. 
            Deploy faster, monitor smarter, and scale effortlessly without the Ops headache.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <div 
            onClick={handleAddProject}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-900"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
            </div>
            
            <div className="h-12 w-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Add New Project</h3>
            <p className="text-zinc-400 mb-8">Start a new pipeline setup from scratch with our AI wizard. Connect GitHub and go live in minutes.</p>
            
            <button className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition">
              Create Project <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          </div>

          <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all hover:border-emerald-500/50 hover:bg-zinc-900">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
            </div>

            <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Existing Projects</h3>
            <p className="text-zinc-400 mb-8">Jump back into your active deployments and monitoring dashboards. Check health status and logs.</p>
            
            <Link href={user ? "/dashboard" : "/login"}>
              <button className="flex items-center text-emerald-400 font-semibold group-hover:text-emerald-300 transition">
                Go to Dashboard <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}