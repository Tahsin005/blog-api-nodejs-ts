import dotenv from 'dotenv';

import type ms from 'ms';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: [
        'http://blog-api-nodejs-ts.onrender.com',
    ],
    WHITELISTED_ADMIN_MAIL : [
        'tahsin.ferdous3546@gmail.com',
        'codewithtahsin@gmail.com',
        'mtfferdous35@gmail.com',
    ],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY  as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
    defaultResLimit: 20,
    defaultResOffset: 0,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};

export default config;