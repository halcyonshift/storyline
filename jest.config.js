module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    collectCoverage: true,
    collectCoverageFrom: ['./src/StoryLine/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    coveragePathIgnorePatterns: [
        "./src/StoryLine/index.tsx",
        "./src/StoryLine/i18n.ts",
        "./src/StoryLine/App.tsx"
    ],
    moduleNameMapper: {
      "@sl/(.*)": "<rootDir>/src/StoryLine/$1"
    },
    testMatch: ['**/*.test.{ts,tsx}'],
    transform: {
      "\\.[jt]sx?$": "babel-jest"
    },
    transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
    setupFiles: ['dotenv/config']
};