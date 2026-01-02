import { Router } from "express";
import {
    createHealthRecord,
    getHealthRecords,
    getRecordsByAnimal,
    getUpcomingRecords,
    updateHealthRecord,
    deleteHealthRecord
} from "../controllers/health.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Special routes (must be before /:id to avoid conflicts)
router.route("/upcoming").get(getUpcomingRecords);
router.route("/animal/:animalId").get(getRecordsByAnimal);

// Main CRUD routes
router.route("/")
    .post(upload.single("photo"), createHealthRecord)  // Create with optional receipt photo
    .get(getHealthRecords);                             // Get all with filters

router.route("/:id")
    .put(upload.single("photo"), updateHealthRecord)    // Update with optional new photo
    .delete(deleteHealthRecord);                        // Delete record

export default router;