module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Mapeia imports de módulos com extensão .js
  },
  transformIgnorePatterns: [
    "node_modules/(?!(mongodb-memory-server|mongodb-memory-server-core)/)",
  ],
  testTimeout: 30000,
};