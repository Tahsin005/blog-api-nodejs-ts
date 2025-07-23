import { Router } from "express";
import { body } from "express-validator";

// controllers
import register from "@/controllers/v1/auth/register";

// middlewares
import validationError from "@/middlewares/validationError";

// models
import User from "@/models/user";


const router = Router();

router.post(
    '/register',
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.findOne({ email: value });
            if (userExists) {
                throw new Error('User email or password is invalid');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be between 6 and 20 characters'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"'),
    validationError,
    register,
);

export default router;