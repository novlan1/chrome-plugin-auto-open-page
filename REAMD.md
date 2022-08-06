# chrome-plugin-auto-open-page

自动打开网页

需要自己提前写好env.local.js文件，格式如env.js，主要是注入以下几个变量：

```ts
// 监听URL
var WATCH_URL = ''; 

// 点击元素
var CLICK_ELEMENT = '';

// 自动关闭的URL
var AUTO_CLOSE_URL = '';
```

