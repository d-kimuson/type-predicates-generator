# Change Log

## Unreleased

## 0.4.0 (2023-02-06)

### Added

- Put a comment at the beginning of the generated file to disable type checking and linter.

### Changed

- When a file fails to be extracted, a warning message is showed instead of exiting unexpectedly.
- Change typescript dependencies to peerDependencies. Type resolution should be done in the version of the project in use.

### Fixed

- Fix validation failure for optional array types when undefined
- Functions under the object skip validation

## 0.3.1 (2021-12-10)

### Features

- Add an option to generate JSDoc-style comments ([#1](https://github.com/d-kimuson/type-predicates-generator/issues/1)) ([b03437d](https://github.com/d-kimuson/type-predicates-generator/commit/b03437dd1e76103de894d9fff9de8ace63173f24))

## 0.3.2 (2022-04-16)

### Features

- Add option for prohibit unlisted properties ([#3](https://github.com/d-kimuson/type-predicates-generator/pull/3))
