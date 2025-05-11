function hookXhr(cb) {
  const originalOpen = XMLHttpRequest.prototype.open;
  console.log('originalOpen', originalOpen);
  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url; // 记录请求URL
    originalOpen.apply(this, arguments);
  };

  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', function () {
      console.log('this', this);
      if (this.readyState === 4) {
        console.log('XHR response:', this.responseText); // 获取响应数据
        cb({
          type: 'xhr_response',
          data: this.responseText,
          url: this._url,
        });
      }
    });
    originalSend.apply(this, arguments);
  };
}


async function saveData(data, fileName) {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // 创建下载链接并触发点击
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
}


hookXhr(({ url, data }) => {
  if (url.startsWith('/detail/get/detail')) {
    const reg = /detail\?id=(\w+)$/;

    const match = url.match(reg);
    console.log('match', match);

    const fileName = match?.[1] || url;
    console.log('fileName', fileName);
    saveData(data, `gaode-${fileName}.json`);
  }
});
