import { Router } from "express";
import { body, cookie } from "express-validator";
import bcrypt from "bcrypt";

// controllers
import register from "@/controllers/v1/auth/register";
import login from "@/controllers/v1/auth/login";
import refreshToken from "@/controllers/v1/auth/refresh_token";
import logout from "@/controllers/v1/auth/logout";

// middlewares
import validationError from "@/middlewares/validationError";
import authenticate from "@/middlewares/authenticate";

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
        .withMessage('Password must be atleast 8 characters'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role must be a string')
        .isIn(['user', 'admin'])
        .withMessage('Role must be either "user" or "admin"'),
    validationError,
    register,
);

router.post(
    '/login',
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
            if (!userExists) {
                throw new Error('User email or password is invalid');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be between 6 and 20 characters')
        .custom(async (value, { req }) => {
            const { email } = req.body as { email: string };
            const user = await User.findOne({ email })
            .select('password')
            .lean()
            .exec();

            if (!user) {
                throw new Error('User email or password is invalid');
            }

            const passwordMatch = await bcrypt.compare(value, user.password);
            if (!passwordMatch) {
                throw new Error('User email or password is invalid');
            }
        }),
    validationError,
    login,
);

router.post(
    '/refresh-token',
    cookie('refresh_token')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isJWT()
        .withMessage('Invalid refresh token'),
    validationError,
    refreshToken,
);

router.post(
    '/logout',
    authenticate,
    logout,
);

export default router;