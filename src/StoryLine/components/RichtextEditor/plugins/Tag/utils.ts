export const stripSlashes = (text: string) =>
    text
        .split('/')
        .filter((v) => v !== '')
        .join('/')
