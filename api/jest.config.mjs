export default {
  testEnvironment: "node",
  transform: {},
  testMatch: [
    "**/?(*.)+(spec|test).mjs",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],

  // Keeps imports consistent if some files add/remove .js
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};