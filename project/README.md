# vue-shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Skillbox Study API
API is [Here](https://vue-study.skillbox.cc/#/).


# Переход на Vue3
## Обновить CLI
npm i -g @vue/cli

## Обновить проект
*Удалить старые пакеты*
npm rm vue-template-compiler eslint-plugin-vue @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/t @vue/cli-plugin-router @vue/cli-plugin-vuex

*Установить клиентские скрипты*
npm i vue@next vuex@next vue-router@next

*Установить остальные проектные пакеты*
npm i -D @vue/compiler-sfc eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-vue 
@vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint eslint babel-eslint

*Добавить правила для esLint*
заменить `plugin:vue/essential` на `plugin:vue/vue3-essential`

*Исправить инициализацию*
`new Vue` -> `createApp`
`new VueRouter` -> `createRouter` + `createWebHistory`
`new Vuex.Store` -> `createStore`
`Vue.use` -> `app.use`