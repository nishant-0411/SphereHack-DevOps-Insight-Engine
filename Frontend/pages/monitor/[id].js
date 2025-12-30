import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"

export default function MonitorPage() {
    const router = useRouter()
    const { id } = router.query
    const [deployment, setDeployment] = useState(null)
    const logsEndRef = useRef(null)

    useEffect(() => {
        if (!id) return

        const fetchLogs = async () => {
            try {
                const res = await fetch(`http://localhost:3005/api/deployments/${id}`)
                const data = await res.json()
                setDeployment(data)
            } catch (err) {
                console.error("Failed to fetch logs")
            }
        }

        const interval = setInterval(fetchLogs, 2000)
        fetchLogs()

        return () => clearInterval(interval)
    }, [id])

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [deployment?.logs])

    if (!deployment) return <div style={styles.container}>Loading deployment data...</div>

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Deployment Monitor</h2>
                <div style={styles.meta}>
                    <p><strong>Repo:</strong> {deployment.repo}</p>
                    <p><strong>Platform:</strong> {deployment.platform}</p>
                    <p>
                        <strong>Status:</strong>
                        <span style={{
                            color: deployment.status === "ACTIVE" ? "green" : deployment.status === "FAILED" ? "red" : "orange",
                            fontWeight: "bold",
                            marginLeft: "6px"
                        }}>
                            {deployment.status}
                        </span>
                    </p>
                </div>
            </div>

            <div style={styles.terminal}>
                {deployment.logs.map((log, i) => (
                    <div key={i} style={styles.logLine}>
                        <span style={styles.timestamp}>[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                    onClick={async () => {
                        const btn = document.getElementById("analyze-btn");
                        if (btn) btn.innerText = "Analyzing...";
                        try {
                            const res = await fetch(`http://localhost:3005/api/deployments/${id}/analyze`, { method: "POST" });
                            const data = await res.json();
                            setDeployment(prev => ({ ...prev, aiAnalysis: data.analysis }));
                        } catch (e) {
                            alert("Analysis failed");
                        } finally {
                            if (btn) btn.innerText = "🔍 Analyze Log Error";
                        }
                    }}
                    id="analyze-btn"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#8a2be2",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    🔍 Analyze Log Error
                </button>
            </div>

            {deployment.aiAnalysis && (
                <div style={
                    deployment.aiAnalysis.includes("✅ No errors detected")
                        ? styles.successBox
                        : styles.aiBox
                }>
                    <h3>
                        {deployment.aiAnalysis.includes("✅ No errors detected")
                            ? "✅ Deployment Status"
                            : "🤖 AI Ops - Error Analysis"}
                    </h3>
                    <p style={{ whiteSpace: "pre-wrap" }}>{deployment.aiAnalysis}</p>

                    {!deployment.aiAnalysis.includes("✅ No errors detected") && (
                        <button style={styles.fixButton} onClick={() => alert("Auto-Fix applied! Restarting deployment...")}>
                            Auto-Fix & Redeploy
                        </button>
                    )}
                </div>
            )}

            <button style={styles.backButton} onClick={() => router.push("/dashboard")}>
                Back to Dashboard
            </button>
        </div>
    )
}

const styles = {
    container: { padding: "40px", maxWidth: "900px", margin: "0 auto", fontFamily: "monospace" },
    header: { marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" },
    meta: { display: "flex", gap: "20px", fontSize: "16px" },
    terminal: {
        backgroundColor: "#1e1e1e",
        color: "#00ff00",
        padding: "20px",
        borderRadius: "8px",
        height: "400px",
        overflowY: "auto",
        fontFamily: "Courier New, monospace",
        fontSize: "14px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
    },
    logLine: { marginBottom: "4px" },
    timestamp: { color: "#888", marginRight: "8px" },
    aiBox: {
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#fff0f0",
        border: "1px solid red",
        borderRadius: "8px",
        color: "#d8000c"
    },
    successBox: {
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f0fff4",
        border: "1px solid #48bb78",
        borderRadius: "8px",
        color: "#2f855a"
    },
    fixButton: {
        marginTop: "10px",
        padding: "8px 16px",
        backgroundColor: "#d8000c",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
    },
    backButton: {
        marginTop: "20px",
        padding: "10px 20px",
        cursor: "pointer",
        backgroundColor: "#333",
        color: "white",
        border: "none",
        borderRadius: "5px"
    }
}
