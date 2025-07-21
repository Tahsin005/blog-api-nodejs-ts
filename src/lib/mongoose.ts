import mongoose from "mongoose";

import config from "@/config";
import { logger } from "@/lib/winston";

import type { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
    dbName: 'blog-db',
    appName: 'Blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

// establish connection to MongoDB
export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error('MongoDB URI is not defined in the environment variables.');
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('Connected to database successfully...', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        logger.error('Error connecting to database:', error);
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.warn('Disconnected from database successfully.', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        logger.error('Error disconnecting to database:', error);
    }
};