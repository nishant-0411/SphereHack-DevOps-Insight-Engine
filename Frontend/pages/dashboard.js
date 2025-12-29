"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const name = localStorage.getItem("user_name");

    if (!email) {
      router.push("/login");
      return;
    }
    setUserName(name || email.split("@")[0]);

    fetch("http://localhost:3005/api/deployments")
      .then((res) => res.json())
      .then((data) => {
        setDeployments(data);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to terminate this deployment?")) return;
    try {
      await fetch(`http://localhost:3005/api/deployments/${id}`, {
        method: "DELETE",
      });
      setDeployments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete deployment");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-400 font-mono">
        <span className="animate-pulse">Initializing Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30">

      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full"></div>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">DevOps-Insight-Engine</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem active label="Overview" icon={<HomeIcon />} />
          <NavItem label="Deployments" icon={<ServerIcon />} />
          <NavItem label="Activity Logs" icon={<ActivityIcon />} />
          <NavItem label="Settings" icon={<SettingsIcon />} />
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <LogOutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="ml-0 md:ml-64 flex-1 p-8">

        <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-2xl text-zinc-300 mt-1">
              Welcome back, <span className="text-zinc-100 font-medium">{userName}</span>. System is operational.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-1xl text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              All Systems Normal
            </div>
            <button onClick={handleLogout} className="md:hidden text-sm text-zinc-400">Logout</button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <StatCard label="Active Deployments" value={deployments.length} />
          <StatCard label="Total Requests" value="12" subtext="Last 24h" />
          <StatCard label="Avg. Response Time" value="48ms" subtext="Optimal" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Your Deployments</h2>
            <Link href="/github">
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-all">
                <PlusIcon /> New Project
              </button>
            </Link>
          </div>

          {deployments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50">
                <ServerIcon className="text-zinc-500" />
              </div>
              <h3 className="text-zinc-300 font-medium">No active deployments</h3>
              <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
                Ready to launch? Connect a GitHub repository to start your automated DevOps pipeline.
              </p>
              <Link href="/github">
                <button className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-mono hover:underline">
                  $ init new-project
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {deployments.map((d) => (
                <div key={d._id} className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900">

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                        <span className="font-mono text-lg font-bold text-white">
                          {d.repo ? d.repo.substring(0, 2).toUpperCase() : "??"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm truncate max-w-[140px]" title={d.repo}>{d.repo}</h3>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          {d.platform} <span className="text-zinc-700">•</span> git-main
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={d.status} />
                  </div>

                  <div className="mt-4 flex items-center gap-3 border-t border-zinc-800/50 pt-4">
                    <Link href={`/monitor/${d._id}`} className="flex-1">
                      <button className="w-full rounded bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 transition-colors">
                        View Logs
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="rounded p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Terminate Deployment"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {subtext && <span className="text-xs text-zinc-500">{subtext}</span>}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const isLive = status?.toLowerCase().includes('success') || status?.toLowerCase().includes('live');
  const isError = status?.toLowerCase().includes('fail') || status?.toLowerCase().includes('error');
  let colorClass = "bg-zinc-800 text-zinc-400 border-zinc-700";
  if (isLive) colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (isError) colorClass = "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      {status || "Unknown"}
    </span>
  )
}

function NavItem({ active, label, icon }) {
  return (
    <button className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"}`}>
      {icon}
      {label}
    </button>
  )
}

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const ServerIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>;