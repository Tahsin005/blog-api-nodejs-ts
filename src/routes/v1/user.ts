import { Router } from "express";
import { param, query, body } from "express-validator";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";

import User from "@/models/user";

import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";

const router = Router();

router.get(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    getCurrentUser
);

router.put(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    body('username')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Username must be less than 20 characters')
        .custom(async (value) => {
            const userExists = await User.exists({ username: value });

            if (userExists) {
                throw new Error('This username is already in use ');
            }
        }),
    body('email')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });

            if (userExists) {
                throw new Error('This email is already in use');
            }
        }),
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('first_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('First name must be less than 20 characters'),
    body('last_name')
        .optional()
        .isLength({ max: 20 })
        .withMessage('Last name must be less than 20 characters'),
    body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
        .optional()
        .isURL()
        .withMessage('Invalid URL')
        .isLength({ max: 100 })
        .withMessage('URL must be less than 100 characters'),
    validationError,
    updateCurrentUser
);

router.delete(
    '/current',
    authenticate,
    authorize(['user', 'admin']),
    deleteCurrentUser
);
export default router;