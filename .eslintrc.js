module.exports = {
  'env': {
    'node': true,
    'es6': true
  },
  'extends': 'airbnb-base',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
    'UniqueConstraintError': 'readonly'
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'import/extensions': 0,
    'no-console': 0,
  },
  'overrides': [
    {
      'files': ['**/*.test.js'],
      'env': {
        'mocha': true,
      }
    },
  ],
};
