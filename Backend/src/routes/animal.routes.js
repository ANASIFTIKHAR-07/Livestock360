    import { Router } from "express";
    import {
        createAnimal,
        getAnimals,
        getAnimalById,
        updateAnimal,
        deleteAnimal,
        getAnimalStats
    } from "../controllers/animal.controller.js";
    import { verifyJWT } from "../middlewares/auth.middleware.js";
    import { upload } from "../middlewares/multer.middleware.js";

    const router = Router();

    // All routes require authentication
    router.use(verifyJWT);

    // Statistics route (must be before /:id to avoid conflict)
    router.route("/stats").get(getAnimalStats);

    // Main CRUD routes
    router.route("/")
        .post(upload.single("photo"), createAnimal)  // Create with optional photo
        .get(getAnimals);                             // Get all with filters

    router.route("/:id")
        .get(getAnimalById)                           // Get single animal
        .put(upload.single("photo"), updateAnimal)    // Update with optional new photo
        .delete(deleteAnimal);                        // Soft delete

    export default router;