const path = require('path');

module.exports = {
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json']
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: [path.join(__dirname, 'tsconfig.eslint.json')]
      }
    }
  }
};
