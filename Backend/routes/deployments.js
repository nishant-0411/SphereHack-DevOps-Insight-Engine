const express = require("express")
const router = express.Router()
const Deployment = require("../models/Deployment")
const simpleGit = require("simple-git")
const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")
const axios = require("axios")


async function appendLog(id, message) {
    const line = `[${new Date().toLocaleTimeString()}] ${message}`
    await Deployment.findByIdAndUpdate(id, { $push: { logs: line } })
}

async function cloneRepository(deploymentId, repoUrl) {
    const deployment = await Deployment.findById(deploymentId)

    if (!repoUrl) {
        await appendLog(deploymentId, "❌ Error: Repository URL is missing.")
        throw new Error("Repository URL is missing")
    }

    const buildDir = path.join(__dirname, "..", "tmp", "builds", deploymentId.toString())

    if (fs.existsSync(buildDir)) fs.rmSync(buildDir, { recursive: true, force: true })
    fs.mkdirSync(buildDir, { recursive: true })

    await appendLog(deploymentId, `Cloning ${repoUrl}...`)
    await simpleGit().clone(repoUrl, buildDir)
    await appendLog(deploymentId, "Repository cloned successfully.")

    return buildDir
}


async function deploySimulated(deploymentId) {
    await appendLog(deploymentId, "Initializing simulated deployment environment...")
    await new Promise(r => setTimeout(r, 2000))

    await Deployment.findByIdAndUpdate(deploymentId, { status: "BUILDING" })
    await appendLog(deploymentId, "Building project...")

    if (Math.random() > 0.7) {
        await appendLog(deploymentId, "❌ Error: Build failed. Missing dependency 'lib-optimus'.")
        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
        return
    }

    await new Promise(r => setTimeout(r, 3000))
    await appendLog(deploymentId, "Build complete. Allocating resources...")
    await Deployment.findByIdAndUpdate(deploymentId, { status: "DEPLOYED" })
    await appendLog(deploymentId, "🚀 Service is live at: https://vercel.app/project-xyz")
}

async function deployToVercel(deploymentId, repoUrl, credentials) {
    try {
        await appendLog(deploymentId, "Starting Vercel Deployment...")
        const buildDir = await cloneRepository(deploymentId, repoUrl)

        await Deployment.findByIdAndUpdate(deploymentId, { status: "BUILDING" })

        const token = credentials["Vercel Token"]
        if (!token) throw new Error("Vercel Token is required")

        await appendLog(deploymentId, "Triggering Vercel Deploy...")

        const vercel = spawn(
            "npx",
            ["vercel", "deploy", "--prod", "--token", token, "--yes"],
            { cwd: buildDir }
        )

        vercel.stdout.on("data", (data) =>
            appendLog(deploymentId, `[Vercel]: ${data.toString().trim()}`)
        )

        vercel.stderr.on("data", (data) =>
            appendLog(deploymentId, `[Vercel Info]: ${data.toString().trim()}`)
        )

        vercel.on("close", async (code) => {
            if (code === 0) {
                await appendLog(deploymentId, "✅ Vercel Deployment Successful!")
                await Deployment.findByIdAndUpdate(deploymentId, { status: "DEPLOYED" })
            } else {
                await appendLog(deploymentId, "❌ Vercel Deployment Failed.")
                await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
            }
        })
    } catch (err) {
        await appendLog(deploymentId, `❌ Error: ${err.message}`)
        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
    }
}

async function deployToDocker(deploymentId, repoUrl, credentials) {
    try {
        await appendLog(deploymentId, "Starting Docker Deployment Process...")
        const buildDir = await cloneRepository(deploymentId, repoUrl)

        await Deployment.findByIdAndUpdate(deploymentId, { status: "BUILDING" })
        await appendLog(deploymentId, "Analyzing project structure...")

        const files = fs.readdirSync(buildDir)
        const hasPackageJson = files.includes("package.json")
        const hasIndexHtml = files.includes("index.html") || files.includes("index.htm")

        if (!hasPackageJson && hasIndexHtml) {
            await appendLog(deploymentId, "⚠️ Static Site Detected. Using Nginx.")
            const nginxDockerfile = `
FROM nginx:alpine
COPY . /usr/share/nginx/html
            `.trim()
            fs.writeFileSync(path.join(buildDir, "Dockerfile"), nginxDockerfile)
        }

        await appendLog(deploymentId, "Building Docker Image...")

        const username = credentials["Username"] || "localuser"
        const repoName = repoUrl.split("/").pop().replace(".git", "").toLowerCase()
        const imageName = `${username}/${repoName}:${deploymentId}`

        await appendLog(deploymentId, `Image Tag: ${imageName}`)

        const build = spawn("docker", ["build", "--no-cache", "-t", imageName, "."], {
            cwd: buildDir
        })

        build.stdout.on("data", (data) =>
            appendLog(deploymentId, `[Docker Build]: ${data.toString().trim()}`)
        )

        build.stderr.on("data", (data) =>
            appendLog(deploymentId, `[Docker Info]: ${data.toString().trim()}`)
        )

        build.on("close", async (code) => {
            if (code === 0) {
                await appendLog(deploymentId, "✅ Docker Image Built Successfully.")

                await appendLog(deploymentId, "Starting Container...")
                const run = spawn("docker", ["run", "-d", "-P", imageName])

                run.stdout.on("data", (data) =>
                    appendLog(deploymentId, `[Container ID]: ${data.toString().trim()}`)
                )

                run.on("close", async (runCode) => {
                    if (runCode === 0) {
                        await appendLog(deploymentId, "✅ Container Running!")
                        await Deployment.findByIdAndUpdate(deploymentId, { status: "DEPLOYED" })
                    } else {
                        await appendLog(deploymentId, "❌ Failed to start container.")
                        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
                    }
                })
            } else {
                await appendLog(deploymentId, "❌ Docker Build Failed.")
                await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
            }
        })
    } catch (err) {
        await appendLog(deploymentId, `❌ Critical Error: ${err.message}`)
        await Deployment.findByIdAndUpdate(deploymentId, { status: "FAILED" })
    }
}

router.get("/", async (req, res) => {
    const data = await Deployment.find().sort({ createdAt: -1 })
    res.json(data)
})

router.get("/:id", async (req, res) => {
    const deployment = await Deployment.findById(req.params.id)
    res.json(deployment)
})

router.delete("/:id", async (req, res) => {
    try {
        await Deployment.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch {
        res.status(500).json({ error: "Failed to delete" })
    }
})

router.post("/:id/analyze", async (req, res) => {
    try {
        const deployment = await Deployment.findById(req.params.id)
        if (!deployment) return res.status(404).json({ error: "Deployment not found" })

        const logs = deployment.logs.join("\n")

        const SUCCESS_PATTERNS = [
            /vercel deployment successful/i,
            /docker image built successfully/i,
            /container running!/i,
            /service is live/i,
            /status:\s*deployed/i
        ]

        const FAILURE_PATTERNS = [
            /❌/i,
            /error/i,
            /failed/i,
            /exception/i,
            /exit code (?!0)/i
        ]

        const isSuccess = SUCCESS_PATTERNS.some(p => p.test(logs))
        const isFailure = FAILURE_PATTERNS.some(p => p.test(logs))

        console.log("--- ANALYSIS DEBUG ---")
        console.log("Log Length:", logs.length)
        console.log("Is Success Regex Match:", isSuccess)
        console.log("Is Failure Regex Match:", isFailure)

        if (isSuccess) {
            console.log("✅ Skipped AI: Detected Success Pattern")
            deployment.aiAnalysis = "✅ No errors detected. Deployment completed successfully."
            await deployment.save()
            return res.json({ success: true, severity: "NONE", analysis: deployment.aiAnalysis })
        }

        console.log("🤖 Calling AI Model:", "tinyllama")
        const prompt = `
Task: Identify the error in these logs.
Logs:
${logs.slice(-2000)}

If success, say "NO ERROR".
If error, explain in 1 sentence.
`

        let analysis = "AI Analysis Unavailable. Ensure Ollama is running."

        try {
            const response = await axios.post("http://127.0.0.1:11434/api/generate", {
                model: "tinyllama",
                prompt,
                stream: false
            })
            console.log("AI Raw Response:", response.data?.response)
            analysis = response.data?.response || analysis
        } catch (e) {
            console.error("AI Connection Failed:", e.message)
            analysis = "Failed to connect to AI engine. Is Ollama running?"
        }

        deployment.aiAnalysis = analysis
        await deployment.save()

        res.json({ success: true, severity: "HIGH", analysis })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Analysis failed" })
    }
})

router.post("/", async (req, res) => {
    const { repoUrl, platform, credentials } = req.body

    if (!repoUrl) return res.status(400).json({ error: "Repository URL is required" })

    const deployment = await Deployment.create({
        repo: repoUrl,
        platform,
        status: "QUEUED",
        logs: ["Deployment Queued..."]
    })

    res.json(deployment)

    if (platform === "Vercel") deployToVercel(deployment._id, repoUrl, credentials)
    else if (platform === "Docker") deployToDocker(deployment._id, repoUrl, credentials)
    else deploySimulated(deployment._id)
})

module.exports = router
