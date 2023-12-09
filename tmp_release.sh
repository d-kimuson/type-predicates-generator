##!/usr/bin/env bash

pnpm build
pnpm commit-and-tag-version
git push --follow-tags origin main && pnpm publish
