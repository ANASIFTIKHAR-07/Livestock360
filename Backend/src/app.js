import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()


app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
}))

app.use(cookieParser())
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(express.static("public"))


import userRouter from "./routes/user.routes.js"
import animalRouter from "./routes/animal.routes.js"
import healthRouter from "./routes/health.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/animals", animalRouter)
app.use("/api/v1/health-records", healthRouter);
app.use("/api/v1/dashboard", dashboardRouter);


// Health check route
app.get("/", (req, res) => {
    res.json({ 
        success: true,
        message: "Livestock360 API is running!",
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
export {app}
