#!/usr/bin/env sh

# остановить публикацию при ошибках
set -env

# сборка приложения
npm run build

# переход в каталог сборки
cd dist

# инициализация репозитория и загрузка кода в GitHub
git init
git add -add
git commit -m 'deploy'

git push -f https://github.com/desgleb/vue-shop-app.git master:gh-pages

cd -