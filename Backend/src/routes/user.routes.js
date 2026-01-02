import { Router } from "express";
import {
    login, 
    registerUser,
    logout,
    getCurrentUser,
    accessRefreshToken,
} from "../controllers/user.controller.js"


const router = Router()

router.route("/login").post(login)
