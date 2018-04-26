# middle-layer

nodejs中间层容器

将nodejs应用以模块的形式，提供给子项目和主项目使用，统一开发、测试和正式环境。

# 使用

因为测试环境和线上环境中，主项目和所有子项目公用一个应用实例，所以子项目和主项目的package.json的依赖中需要像如下方式引用：

```
"middle-layer": ">0.0.0"
```

## 暴露的方法
## 其他常用，默认会暴露以下模块

* koa-router => Router
* mongoose => mongoose

## 发布

```
npm run dist

npm version patch

npm publish
```
