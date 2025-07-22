import { Schema, model } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        x?: string;
        youtube?: string;
    };
};

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            maxLength: [20, 'Username cannot exceed 20 characters'],
            unique: [true, 'Username must be unique'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email cannot exceed 50 characters'],
            unique: [true, 'Email must be unique'],
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            enum: {
                values: ['user', 'admin'],
                message: '{VALUE} is not supported',
            },
            default: 'user',
        },
        firstName: {
            type: String,
            maxLength: [20, 'First name cannot exceed 20 characters'],
        },
        lastName: {
            type: String,
            maxLength: [20, 'Last name cannot exceed 20 characters'],
        },
        socialLinks: {
            website: {
                type: String,
                maxLength: [100, 'Website address cannot exceed 100 characters'],
            },
            facebook: {
                type: String,
                maxLength: [100, 'Facebook profile url cannot exceed 100 characters'],
            },
            instagram: {
                type: String,
                maxLength: [100, 'Instagram profile url cannot exceed 100 characters'],
            },
            linkedin: {
                type: String,
                maxLength: [100, 'LinkedIn profile url cannot exceed 100 characters'],
            },
            x: {
                type: String,
                maxLength: [100, 'X (Twitter) profile url cannot exceed 100 characters'],
            },
            youtube: {
                type: String,
                maxLength: [100, 'YouTube channel url cannot exceed 100 characters'],
            },
        },
    }, {
        timestamps: true,
    },
);

export default model<IUser>('User', userSchema);