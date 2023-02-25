module.exports = {
    preset: "ts-jest",
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['./src/StoryLine/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    coveragePathIgnorePatterns: [
        "./src/StoryLine/index.tsx",
        "./src/StoryLine/i18n.ts",
        "./src/StoryLine/App.tsx"
    ],
    transform: {
      "\\.[jt]sx?$": "babel-jest"
    },
    transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
};