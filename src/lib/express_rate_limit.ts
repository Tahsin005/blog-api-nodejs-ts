import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 60000, // 1 minute
    limit: 60, // limit each IP to 60 requests per window per ip
    standardHeaders: 'draft-8',
    legacyHeaders: false, // disable the `X-RateLimit-*` headers
    message: {
        error: 'You have exceeded the number of requests allowed. Please try again later.',
    },
});

export default limiter;