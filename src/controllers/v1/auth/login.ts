import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from "@/config";

import User from "@/models/user";
import Token from "@/models/token";

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as UserData;

        const user = await User.findOne({ email })
        .select('username email password role')
        .lean()
        .exec();
        if (!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found',
            });
            logger.warn(`Unauthorized login attempt by: ${email}`);
            return;
        }
        // generate access token and refresh token for new user
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // store refresh token in the db
        await Token.create({
            token: refreshToken,
            userId: user._id,
        });
        logger.info(`Refresh token stored for user:`, {
            token: refreshToken,
            userId: user._id,
        });

        // set cookies
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(201).json({
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
            },
            access_token: accessToken,
        });

        logger.info(`User logged in successfully:`, {
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        });
        logger.error(`Error during login: ${error}`);
    }
};

export default login;