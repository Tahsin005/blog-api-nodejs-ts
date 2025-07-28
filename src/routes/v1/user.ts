import { Router } from "express";
import { param, query, body } from "express-validator";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";

import User from "@/models/user";

const router = Router();


export default router;