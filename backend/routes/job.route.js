import express from "express";
import { postJob, getAllJobs, getJobById, getAdminJobs, updateJob } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Job routes
router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/admin/jobs").get(isAuthenticated, getAdminJobs);
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;
