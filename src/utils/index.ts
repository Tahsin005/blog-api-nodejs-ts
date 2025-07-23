// Generate a random username

export const genUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).substring(2);

    const username = usernamePrefix + randomChars;
    return username;
};