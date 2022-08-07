# chrome-plugin-auto-open-page

自动打开网页的chrome插件


_____


需要自己提前写好env.local.js文件，格式如env.js，主要是注入以下几个变量：

```ts
// 监听URL
var WATCH_URL = ''; 

// 点击元素
var CLICK_ELEMENT = '';

// 自动关闭的URL
var AUTO_CLOSE_URL = '';
```

其中 CLICK_ELEMENT内容 会被 `document.querySelector` 使用来获取元素。下面是 querySelector 几种常见的用法。


1. 获取带有foo或bar样式的首个元素

```js
document.querySelector('.foo, .bar');
```

2. 获取带有 data-info 属性的元素

```js
document.querySelector('[data-info]');
```

3. 获取带有 data-info 属性的 p 元素

```js
document.querySelector('p[data-info]');
```

4. 获取带有 data-info 为 foo 属性的 p 元素

```js
document.querySelector('p[data-info=foo]');
```

或者获取 id 为 my-element 的 p 元素

```js
let el  = document.querySelector("p[id='my-element']")
```



5. 获取第 3 个 class 为 article-item 的元素


```js
document.querySelector('.article_item:nth-child(3)')

// 第一个
document.querySelector('.article_item:first-child')

// 最后一个
document.querySelector('.article_item:last-child')
```

6. 获取不具有某属性的节点

```ts
<div class="whatFor?" ></div>

// 合法用法，注意not后面的内容被小括号包裹
document.querySelector("div:not([uuid])");

// 获取
document.querySelector("div:not([uuid=1])");

// 或者
document.querySelector(":not([uuid])");
```


参考：
1. https://www.runoob.com/cssref/css-selectors.html
2. https://www.runoob.com/jsref/met-element-queryselector.html
3. https://www.jianshu.com/p/2e1d5c92f9c4
4. https://xiaoguoping.blog.csdn.net/article/details/51531469


