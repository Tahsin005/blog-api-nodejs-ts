// Generate a random username

export const genUsername = (): string => {
    const usernamePrefix = 'user-';
    const randomChars = Math.random().toString(36).substring(2);

    const username = usernamePrefix + randomChars;
    return username;
};

// Generate a random slug from a title (e.g., my-first-blog-post)

export const genSlug = (title: string): string => {
    const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]\s-/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    const randomChars = Math.random().toString(36).substring(2);
    const uniqueSlug = `${slug}-${randomChars}`;

    return uniqueSlug;
};