import express from 'express';
import cors from 'cors';

import config from '@/config';

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

app.get('/', (req, res) => {
    res.json({
        message: 'Hello, World!'
    });
});

app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
});