import express from "express"
import { getAllStudentsForSubmission, postSubmission } from "../controllers/submission.controllers.js"
import {isLoggedIn} from "../middleware/auth.middleware.js"

const router = express.Router()
router.get("/", isLoggedIn,getAllStudentsForSubmission)
router.post("/post/:studentId", isLoggedIn,postSubmission)

export default router