import express from "express"
import { getAllStudents, getAllStudentsForSubmission, postSubmission } from "../controllers/submission.controllers.js"
import {isLoggedIn} from "../middleware/auth.middleware.js"

const router = express.Router()
router.get("/", isLoggedIn,getAllStudentsForSubmission)
router.post("/post/:studentId", isLoggedIn,postSubmission)
router.post("/get",isLoggedIn,getAllStudents)

export default router