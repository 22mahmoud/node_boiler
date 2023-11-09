module.exports = {
  '*.{js,ts}': 'eslint --cache --fix',
  '**/*.ts': () => 'npm run check-types',
  '*.{json,yaml,css,scss}': ['prettier --write'],
};
