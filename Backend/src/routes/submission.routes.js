import express from "express"
import { getAllStudentsForSubmission } from "../controllers/submission.controllers.js"
import {isLoggedIn} from "../middleware/auth.middleware.js"

const router = express.Router()
router.get("/", isLoggedIn,getAllStudentsForSubmission)

export default router