#!/usr/bin/env sh

# abort on errors
set -e

cd frontend

rm -rf dist

# build
yarn vite build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init -b gh-pages
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git remote add origin https://github.com/Ivang71/ds-test.git
git push -uf origin gh-pages


cd -