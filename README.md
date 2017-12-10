# ssr-demo

> SSR Project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Vue SSR
1. 简书动态网页 SSR
2. 静态站点Vue优化: Prerendering
    - 使用webpack插件 [https://github.com/chrisvfritz/prerender-spa-plugin](prerendering-spa-plugin)

    ```
    plugins: [
        new PrerenderSpaPlugin(
          // Absolute path to compiled SPA
          path.join(__dirname, '../dist'),
          // List of routes to prerender
          [ '/', '/about', '/contact' ]
        )
    ]
    ```
