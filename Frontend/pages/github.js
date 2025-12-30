"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GitHubPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [fixing, setFixing] = useState(false);

  const handleAnalyze = async () => {
    if (!username || !repoUrl || !token) {
      alert("Please fill all fields to initiate scan.");
      return;
    }

    setLoading(true);
    setAnalysis(null); 

    try {
      const res = await fetch("http://localhost:3005/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repoUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data);

      localStorage.setItem("github_username", username);
      localStorage.setItem("github_repo_url", repoUrl);
      localStorage.setItem("github_token", token);
      
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async () => {
    if (!analysis) return;
    setFixing(true);
    try {
      const res = await fetch("http://localhost:3005/api/github/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          repoUrl,
          missing: analysis.missing,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/platform");
    } catch (err) {
      alert("Auto-Fix Protocol Failed: " + err.message);
    } finally {
      setFixing(false);
    }
  };

  const handleContinue = () => {
    router.push("/platform");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4 font-sans text-zinc-200">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      <div className="z-10 w-full max-w-lg space-y-8">
        
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0 3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Connect Repository</h2>
          <p className="mt-2 text-sm text-zinc-400">
          DevOps-Insight-Engine will audit your code structure and generate necessary config files.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl backdrop-blur-xl">
          
          {!analysis ? (
            <div className="space-y-5">
              
              <div className="space-y-4">
                <InputGroup 
                  icon={<UserIcon />}
                  placeholder="GitHub Username"
                  value={username}
                  onChange={setUsername}
                />
                <InputGroup 
                  icon={<LinkIcon />}
                  placeholder="Repository URL (https://github.com/...)"
                  value={repoUrl}
                  onChange={setRepoUrl}
                />
                <InputGroup 
                  icon={<KeyIcon />}
                  placeholder="Personal Access Token (classic)"
                  type="password"
                  value={token}
                  onChange={setToken}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-lg bg-white py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Scanning Repository...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Run Diagnostic Scan <ArrowRightIcon />
                  </span>
                )}
              </button>
              
              <p className="text-center text-xs text-zinc-500">
                We require `repo` and `workflow` scopes to configure Actions.
              </p>
            </div>

          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-lg font-semibold text-white">Diagnostic Report</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${analysis.perfect ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {analysis.perfect ? "Ready for Launch" : "Attention Needed"}
                </span>
              </div>

              <div className="space-y-3">
                <StatusItem 
                    label="Dockerfile Configuration" 
                    isValid={!analysis.missing?.dockerfile} 
                />
                <StatusItem 
                    label="GitHub Actions Workflow" 
                    isValid={!analysis.missing?.githubActions} 
                />
                <StatusItem 
                    label="Repository Access" 
                    isValid={true} 
                />
              </div>

              <div className="pt-4 space-y-3">
                {!analysis.perfect ? (
                    <>
                    <button
                        onClick={handleFix}
                        disabled={fixing}
                        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {fixing ? (
                            <> <Spinner /> Auto-Generating Files... </>
                        ) : (
                            <> <WandIcon /> Fix Issues & Continue </>
                        )}
                    </button>
                    <button 
                        onClick={handleContinue}
                        className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Ignore warnings and proceed anyway
                    </button>
                    </>
                ) : (
                    <button
                        onClick={handleContinue}
                        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
                    >
                        Proceed to Deployment Platform
                    </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputGroup({ icon, type = "text", placeholder, value, onChange }) {
    return (
        <div className="relative group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 group-focus-within:text-blue-500 transition-colors">
                {icon}
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full rounded-lg border border-zinc-800 bg-zinc-950/50 py-3 pl-10 pr-3 text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all sm:text-sm"
            />
        </div>
    )
}

function StatusItem({ label, isValid }) {
    return (
        <div className="flex items-center justify-between rounded-md border border-zinc-800/50 bg-zinc-900/30 p-3">
            <span className="text-sm text-zinc-300">{label}</span>
            {isValid ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <CheckCircleIcon /> Valid
                </div>
            ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                    <XCircleIcon /> Missing
                </div>
            )}
        </div>
    )
}

const Spinner = () => <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const WandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;