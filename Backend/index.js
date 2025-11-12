import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"   
import { connectDB } from "./src/utils/db.js"


//import all routes
import userRoutes from "./src/routes/user.routes.js"
import adminRoutes from "./src/routes/admin.routes.js"
import teacherRoutes from "./src/routes/teacher.routes.js" 
import studentRoutes from "./src/routes/students.routes.js"
import submissionRoutes from "./src/routes/submission.routes.js" 

const app = express()
dotenv.config()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser()) 
app.use(express.urlencoded({ extended: true })) 

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/teachers", teacherRoutes)
app.use("/api/v1/students", studentRoutes)
app.use("/api/v1/submissions", submissionRoutes)

connectDB().then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})