import { Router } from "express";
import { param, query, body } from "express-validator";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize, { AuthRole } from "@/middlewares/authorize";

import User from "@/models/user";

import getCurrentUser from "@/controllers/v1/user/get_current_user";
import updateCurrentUser from "@/controllers/v1/user/update_current_user";
import deleteCurrentUser from "@/controllers/v1/user/delete_current_user";
import getAllUsers from "@/controllers/v1/user/get_all_users";

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

router.get(
    '/all',
    authenticate,
    authorize(['admin']),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be an integer between 1 and 50'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be a non-negative integer'),
    validationError,
    getAllUsers
);

export default router;