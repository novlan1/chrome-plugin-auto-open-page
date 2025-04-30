// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', () => {
  checkWatchTimes();
});
const hrefList = [];
const justHold = time => new Promise(resolve => setTimeout(resolve, time));
const baseUrl = 'https://www.dianping.com/shanghai/ch30/g20042';
const onlyRunUrl = 'https://www.google.com';


function getRandomNumber(min, max) {
  const result = Math.random() * (max - min) + min;
  return result;
}

async function openAllData() {
  const list = Array.from({ length: 50 }).map((_, index) => `${baseUrl}p${index + 1}`)
    .slice(41, 43);
  console.log('list', list);
  return list;
}

async function getListInfo() {
  if (!window.location.href.includes(baseUrl)) {
    return;
  }

  const list = [...document.querySelectorAll('.shop-all-list ul li')];
  for (const item of list) {
    const pic = item.querySelector('.pic a');
    const href = pic.getAttribute('href').trim();
    console.log('href', href);
    hrefList.push(href);
    await window.open(href);
    await justHold(getRandomNumber(1000, 4000));
  }
  await window.close();
}

async function getDetail() {
  const prefix = 'https://www.dianping.com/shop/';
  if (!window.location.href.includes(prefix)) {
    return;
  }

  const core = document.querySelector('body script').textContent.replace(/window\.__xhrCache__\s*\=\s*/, '');
  console.log('window.getDetail', JSON.parse(core));

  const blob = new Blob([core], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const key = window.location.href.replace(prefix, '');
  // 创建下载链接并触发点击
  const a = document.createElement('a');
  a.href = url;
  a.download = `data-${key}.json`;
  a.click();
  await justHold(getRandomNumber(2000, 5000));
  await window.close();
}


async function checkWatchTimes() {
  if (window.location.href.includes('dianping.com')) {
    try {
      await getDetail();
    } catch (err) {
    }
    try {
      await getListInfo();
    } catch (err) {
    }
    return;
  }

  if (window.location.href.includes(onlyRunUrl)) {
    const list = await openAllData();
    for (const item of list) {
      await window.open(item);
      await justHold(15 * 5000);
      await window.close();
    }
  }
}
