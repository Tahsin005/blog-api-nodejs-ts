import mongoose from "mongoose";

import config from "@/config";

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
        console.log('Connected to database successfully...', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        console.log('Error connecting to database:', error);
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from database successfully.', {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }

        console.log('Error disconnecting to database:', error);
    }
};