// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', () => {
  main();
});
const justHold = time => new Promise(resolve => setTimeout(resolve, time));


function getRandomNumber(min, max) {
  const result = Math.random() * (max - min) + min;
  return result;
}
const MIDDLE_START_CONFIG = {
  cityIndex: 38,
  shopIndex: 18,
  notChangeUrl: true,
};

async function slide(sliderBtn) {
  for (let i = 0;i < 300;i += 10) {
    await justHold(100);
    sliderBtn.style.left = `${i}px`;
  }
}

function checkSlider() {
  const sliderBtn = document.querySelector('.nc_iconfont.btn_slide');
  if (!sliderBtn) {
    return;
  }
  slide(sliderBtn);
}

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
        // resolve({
        //   type: 'xhr_response',
        //   data: this.responseText,
        //   url: this._url,
        // });
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

async function getList() {
  const list = [...document.querySelectorAll('.poilist li')];
  console.log('list', list);

  const data = list.map((item) => {
    // console.log('item', item)
    const name = item.querySelector('.ml_30 .row span a')?.innerText.trim();
    const address = item.querySelector('.ml_30 .row.addr span')?.innerText.trim();
    const phone = item.querySelector('.ml_30 .row.tel')?.innerText?.trim() || '';
    const info = {
      name,
      address,
      phone,
    };
    // console.log('info', info)
    return info;
  });
  return data;
}

async function goNext() {
  const nextButton = document.querySelector('a[tid=toNextPage]');
  console.log('nextButton', nextButton);
  if (nextButton && !nextButton.className.includes('next-none')) {
    nextButton.click();
    return true;
  }
  return false;
}


const DOMS = {
  SHOP_ITEM: '.serp-list li.poibox.poibox-normal.amap-marker',
};


async function enterEachDetailPage(cityIndex, pageIndex = 0) {
  await justHold(getRandomNumber(3000, 5000));
  const shops = await document.querySelectorAll(DOMS.SHOP_ITEM);
  const { length } = shops;

  const firstShopIndex = MIDDLE_START_CONFIG.cityIndex === cityIndex && pageIndex === 0
    ? MIDDLE_START_CONFIG.shopIndex
    : 0;

  for (let i = firstShopIndex;i < length;i++) {
    const shops = await document.querySelectorAll(DOMS.SHOP_ITEM);
    const shop = shops[i];

    console.log('shop', shop);
    await shop.click();
    await justHold(getRandomNumber(1500, 2000));
    const backBtn = await document.querySelector('#placereturnfixed i');
    backBtn?.click();
    await justHold(getRandomNumber(10000, 30000));
  }

  const nextPageButton = await document.querySelector('.paging-next .icon-chevronright');
  if (!nextPageButton) {
    return;
  }
  await nextPageButton?.click();

  await justHold(getRandomNumber(1000, 2000));
  const nextShops = await document.querySelectorAll(`${DOMS.SHOP_ITEM} .poi-imgbox`);

  if (nextShops) {
    await enterEachDetailPage(cityIndex, pageIndex + 1);
  }
}

async function main() {
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


  await justHold(getRandomNumber(3000, 4000));
  const TOTAL = 369;
  const START_PAGE = MIDDLE_START_CONFIG.cityIndex;
  for (let i = START_PAGE;i < TOTAL;i++) {
    // const cityName =
    if (!MIDDLE_START_CONFIG.notChangeUrl || i !== START_PAGE) {
      await switchCity(i);
    }
    await enterEachDetailPage(i, 0);

    // return;
    // const allList = [];
    // await loopFetch(allList, cityName || `city-${i}`);
  }
}


async function switchCity(cityIndex = 0) {
  console.log('try switch city start...');
  const btn = document.querySelector('.city-title.usel');
  console.log('city title btn', btn);
  if (btn) {
    btn.click();
  }

  await justHold(getRandomNumber(100, 200));
  const cityButton = document.querySelector('.city-city-title');
  console.log('[cityButton]', cityButton);
  if (cityButton) {
    cityButton.click();
  }

  await justHold(getRandomNumber(100, 200));
  const allCities = [...document.querySelectorAll('dd li[adcode]')];
  console.log('[allCities]', allCities);

  const targetCity = allCities?.[cityIndex];
  console.log('[targetCity]', targetCity);
  if (targetCity) {
    targetCity.click();
  }

  await justHold(getRandomNumber(200, 500));
  const searchInput = document.querySelector('.iptbox input');
  console.log('[searchInput]', searchInput);
  if (searchInput) {
    searchInput.click();
  }
  await justHold(getRandomNumber(200, 500));

  searchInput.value = '网吧';

  await justHold(getRandomNumber(100, 200));
  const searchButton = document.querySelector('#searchbtn i');
  console.log('[searchButton]', searchButton);
  searchButton.click();
  await justHold(getRandomNumber(200, 400));


  // const firstSuggestItem = document.querySelector('.ui3-suggest-item')
  // console.log('[firstSuggestItem]', firstSuggestItem)
  // firstSuggestItem?.click();

  return targetCity?.innerText?.trim();
}


async function loopFetch(allList, cityName) {
  await justHold(getRandomNumber(2000, 4000));
  const list = await getList();
  allList.push(...list);

  const hasNext = await goNext();
  console.log('hasNext', hasNext);
  console.log('allList.length', allList.length);
  if (!hasNext) {
    if (allList.length) {
      saveData(JSON.stringify(allList), `baidu-map-${cityName}.json`);
    } else {
      console.log('数据为空，无需下载');
    }
  } else {
    await loopFetch(allList, cityName);
  }
}


// function getGetCityList() {
//   const allCities = [...document.querySelectorAll('tbody tr a')];
//   console.log('[allCities]', allCities);
//   const cityNames = allCities.map(item => item.innerText?.trim());
//   console.log('cityNames', JSON.stringify(cityNames));
// }
