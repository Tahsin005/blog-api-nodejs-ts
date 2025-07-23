import { logger } from "@/lib/winston";
import config from "@/config";
import { genUsername } from "@/utils";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

import User from "@/models/user";
import Token from "@/models/token";

import type { Request, Response } from "express";
import type { IUser } from "@/models/user";
import { log } from "console";


type UserData = Pick<IUser, 'email' | 'password' | 'role'>

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body as UserData;

    if (role === 'admin' && !config.WHITELISTED_ADMIN_MAIL.includes(email)) {
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You are not allowed to register as an admin',
        });
        logger.warn(`Unauthorized admin registration attempt by: ${email}`);
        return;
    }

    try {
        const username = genUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role: role,
        });

        // generate access token and refresh token for new user
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // store refresh token in the db
        await Token.create({
            token: refreshToken,
            userId: newUser._id,
        });
        logger.info(`Refresh token stored for user:`, {
            token: refreshToken,
            userId: newUser._id,
        });

        // set cookies
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'none',
        });

        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            access_token: accessToken,
        });

        logger.info(`User registered successfully:`, {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (error) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: error
        });
        logger.error(`Error during registration: ${error}`);
    }
};

export default register;