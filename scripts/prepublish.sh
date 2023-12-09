##!/usr/bin/env bash

set -eux

current_branch=$(git branch | grep "*" | cut -f 2 -d " ")

if [ "$current_branch" != "main" ]; then
  echo "main ブランチで実行する必要があります。"
  exit 1
fi

read -p "リリースの種類を選択してください? (patch | minor | major): " release_kind

if [ "$release_kind" != "patch" ] && [ "$release_kind" != "minor" ] && [ "$release_kind" != "major" ]; then
  echo "Invalid release kind"
  exit 1
fi

release_command="pnpm commit-and-tag-version --release-as $release_kind"

git fetch
git merge --ff origin/main

pnpm lint
pnpm test
pnpm build
pnpm publint

$release_command --dry-run

read -p "以上の内容でリリースします。よろしいですか? (y/N): " yN
case $yN in
  "y")
    echo "リリースを開始します。"
    ;;
  "N")
    echo "リリースを中止します。"
    exit 1
    ;;
  *)
    echo "リリースを中止します。"
    exit 1
    ;;
esac

$release_command

echo "リリースが完了しました。"
echo "必要であれば CHANGELOG.md に情報を追加してから git push --follow-tags origin main してください。"
