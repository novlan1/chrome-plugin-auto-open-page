﻿console.log('这是content script!');

const MAX_CLICK_TIMES = 1000;
const WAIT_INTERVAL_TIME = 70000;
const WAIT_CLOSE_TIME = 50000;
let AUTO_CLOSE_URL = '';

let time = 0;

function autoClosePage() {
  if (![AUTO_CLOSE_URL, EXTRA_AUTO_CLOSE_URL].includes(window.location.href)) return;
  console.log('即将自动关闭～');
  setTimeout(() => {
    window.close();
  }, WAIT_CLOSE_TIME);
}

function autoOpenPage() {
  console.log('autoOpenPage');
  if (window.location.href !== WATCH_URL) {
    console.log('\x1B[31m%s\x1B[0m', '不是WATCH_URL, Bye~');
    return;
  }

  const element = document.querySelector(CLICK_ELEMENT);
  if (element.href) {
    AUTO_CLOSE_URL = element.href;
    console.log('\x1B[32m%s\x1B[0m', 'AUTO_CLOSE_URL为： ', AUTO_CLOSE_URL);
  }
  if (!element) return;
  console.log('正在点击~');
  clickElement(() => {
    element.click();
  });
}

function clickElement(cb) {
  if (time > MAX_CLICK_TIMES) return;
  time += 1;

  setTimeout(() => {
	  cb();
    console.log(`执行了一次cb, times: ${time}`);
	  clickElement(cb);
  }, WAIT_INTERVAL_TIME);
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', () =>
{
  autoOpenPage();
  autoClosePage();
});
