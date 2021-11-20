# type-predicates-generator

## Usage

```bash
$ npx type-predicates-generator -o predicates.ts
$ npx type-predicates-generator -w -o predicates.ts # watch mode
```

## Cli Options

| Option                       | Default              | Description                                                      |
| ---------------------------- | -------------------- | ---------------------------------------------------------------- |
| -p, --project                | `tsconfig.json`      | Path for project `tsconfig.json`                                 |
| -f, --file-glob              | `**/*.ts`            | file glob pattern target types                                   |
| -o, --output                 | `type-predicates.ts` | file glob pattern that original types are defined for generated. |
| -b, --base-path              | `./`                 | project base path                                                |
| -a, --asserts                | `false`              | generate assert functions or not                                 |
| -w, --watch                  | `false`              | watch or not                                                     |
| --default-array-check-option | `all`                | how to check child element type. 'all' or 'first'                |

## Contributing

```bash
$ yarn install
$ yarn patch  # fix types compiler API
```
