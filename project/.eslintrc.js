module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    plugins: ['prettier'],
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        parser: "@babel/eslint-parser",
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-var': 'error',
        'prettier/prettier': 'error',
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
};
