import { Router } from "express";
import { param, query, body } from "express-validator";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";

import User from "@/models/user";

import getCurrentUser from "@/controllers/v1/user/get_current_user";

const router = Router();

router.get(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    getCurrentUser
)

export default router;