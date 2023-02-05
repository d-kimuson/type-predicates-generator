module.exports = {
  "**/*.{ts,mts,mcs,mjs,cjs,js,json,md,yml,yaml}": ["prettier --write"],
  "**/*.ts": ["eslint --cache --fix"],
}
