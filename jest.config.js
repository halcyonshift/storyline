module.exports = {
    preset: "ts-jest",
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    coveragePathIgnorePatterns: [
        "./src/index.tsx",
        "./src/reportWebVitals.ts",
        "i18n.ts",
        "preload.ts",
        "renderer.ts",
        "App.tsx"
    ],
    transform: {
      "\\.[jt]sx?$": "babel-jest"
    },
    transformIgnorePatterns: ["node_modules/(?!variables/.*)"]
};