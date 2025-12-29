import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (!email) return alert("Please enter email");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      
      if (data.email) {
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_id", data._id);
        router.push("/dashboard");
      }
    } catch (err) {
      alert("Login failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-row bg-white dark:bg-zinc-950">
      {/* LEFT SIDE - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 sm:px-12 md:w-1/2 lg:px-20 xl:w-[40%] z-10 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Brand / Logo Area */}
          <div className="mb-8 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              DevOps - Insight - Engine
            </span>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Please enter your details to sign in.
          </p>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-zinc-400">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-zinc-400">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-3 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="#"
                  className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Visual & Branding */}
      <div className="relative hidden h-screen w-1/2 overflow-hidden bg-zinc-900 md:flex xl:w-[60%]">
        {/* CSS-based Tech Grid Pattern Background */}
        <div className="absolute inset-0">
                    <img
                        src="https://www.zipitwireless.com/hubfs/IoT%20Deployment.jpg"
                        alt="CI/CD Pipeline Visualization"
                        className="h-full w-full object-cover object-center"
                    />
                </div>
        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-900/10" />

        {/* Content Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-16 text-white xl:p-24">
         {/* A subtle decorative element hinting at connection */}
         <svg className="h-12 w-12 mb-8 text-blue-500 opacity-80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/><path d="M4.93 4.93l14.14 14.14"/><path d="M19.07 4.93L4.93 19.07"/></svg>

          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl">
            Orchestrate Your Infrastructure with Intelligent Automation.
          </h2>
          <p className="mt-6 max-w-xl text-lg text-zinc-300 leading-relaxed">
            DevOps - Insight - Engine connects your fragmented tools into unified workflows. 
            Let AI handle the operational complexity while you focus on innovation.
          </p>
          <div className="mt-8 flex gap-x-4">
              <div className="text-sm text-zinc-400">Need help? <span className="text-zinc-200 underline decoration-zinc-600 underline-offset-4">docs.devopsinsightengine.com</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}