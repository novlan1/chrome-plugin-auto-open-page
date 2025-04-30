// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', () => {
  checkWatchTimes();
});
const justHold = time => new Promise(resolve => setTimeout(resolve, time));


function getRandomNumber(min, max) {
  const result = Math.random() * (max - min) + min;
  return result;
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

async function checkWatchTimes() {
  await justHold(getRandomNumber(2000, 4000));
  const TOTAL = 371;
  const START_PAGE = 5;
  for (let i = START_PAGE;i < TOTAL;i++) {
    const cityName = await switchCity(i);
    const allList = [];
    await loopFetch(allList, cityName || `city-${i}`);
  }
}


async function switchCity(cityIndex = 0) {
  console.log('try switch city start...');
  const btn = document.querySelector('a[map-on-click=selectCity]');
  if (btn) {
    btn.click();
  }

  await justHold(getRandomNumber(1000, 2000));
  const cityButton = document.querySelector('.sel-city-btnr');
  console.log('[cityButton]', cityButton);
  if (cityButton) {
    cityButton.click();
  }

  await justHold(getRandomNumber(1000, 2000));
  const allCities = [...document.querySelectorAll('tbody tr a')];
  console.log('[allCities]', allCities);

  const targetCity = allCities?.[cityIndex];
  console.log('[targetCity]', targetCity);
  if (targetCity) {
    targetCity.click();
  }

  await justHold(getRandomNumber(2000, 5000));
  const searchInput = document.querySelector('.searchbox-content-common');
  console.log('[searchInput]', searchInput);
  if (searchInput) {
    searchInput.click();
  }
  await justHold(getRandomNumber(2000, 5000));

  searchInput.value = '电竞网吧';

  await justHold(getRandomNumber(1000, 2000));
  const searchButton = document.querySelector('#search-button');
  console.log('[searchButton]', searchButton);
  searchButton?.click();
  await justHold(getRandomNumber(2000, 4000));

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
