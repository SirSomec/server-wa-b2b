module.exports = {
  extends: ['next', 'next/core-web-vitals', '../.eslintrc.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  settings: {
    next: {
      rootDir: ['frontend/']
    }
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off'
  }
};
