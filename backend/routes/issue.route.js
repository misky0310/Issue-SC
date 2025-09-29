import express from "express";
import {body} from "express-validator";
import { createIssue,resolveIssue,getIssues,getIssueById,pickIssue } from "../controllers/issue.controller.js";
import { authenticateJWT,authorizeRoles } from "../middlewares/user.middleware.js";

const router = express.Router();

// Create a new issue
router.post("/",authenticateJWT,authorizeRoles("operator","admin"),
    [
        body("name").notEmpty(),
        body("regNo").notEmpty(),
        body("date").notEmpty(),
        body("school").notEmpty(),
        body("programme").notEmpty(),
        body("category").isIn(["Indian", "NRI", "Foreign"]),
        body("gender").isIn(["Male", "Female", "Other"]),
        body("issue").notEmpty()
    ],
    createIssue
);

// Get all issues with optional filters
router.get("/",authenticateJWT,authorizeRoles("operator","faculty","admin"), getIssues);

// Get issue by ID
router.get("/:id",authenticateJWT,authorizeRoles("operator","faculty","admin"), getIssueById);

//Get open issues for faculty to pick
router.get("/open",authenticateJWT,(req,res,next) => {
    req.query.status = "Open";
    return getIssues(req,res,next);
})

// Faculty picks an issue
router.patch("/:id/pick",authenticateJWT,authorizeRoles("faculty"), pickIssue);

// Resolve an issue
router.patch("/:id/resolve",authenticateJWT,authorizeRoles("faculty"), resolveIssue);

export default router;

