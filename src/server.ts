import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';

import config from '@/config';
import limiter from '@/lib/express_rate_limit'; // rate limiting middleware

import type { CorsOptions } from 'cors';

const app = express();

// configure CORS options
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // reject request from non-whitelisted origins
            callback(new Error(`CORS Error: ${origin} is not allowed`), false);
            console.log(`CORS Error: ${origin} is not allowed`);
        }
    },
};

// apply cors middleware
app.use(cors(corsOptions));

// enable json parsing
app.use(express.json());

// enable urlencoded request body parsing
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// enable response compression to reduce payload size to improve performance
app.use(compression({
    threshold: 1024, // compress responses larger than 1KB
}));

// use helmet to set various HTTP headers for security
app.use(helmet());

// apply rate limiting middleware to prevent abuse excessive requests and enhanace security
app.use(limiter);

(async() => {
    try {
        app.get('/', (req, res) => {
            res.json({
                message: 'Hello, World!'
            });
        });

        app.listen(config.PORT, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        if (config.NODE_ENV === 'production') {
            process.exit(1); // exit the process with failure
        }
    }
})();