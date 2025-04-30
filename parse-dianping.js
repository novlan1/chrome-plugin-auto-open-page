const glob = require('glob');
const { readFileSync, writeFileSync, generateCSVData, generateCSV } = require('t-comm');

const TARGET_GLOB = './data/dianping/data-*.json';

const PARSED_DATA_FILE = './data/dianping-parsed.json';
const PARSED_DATA_FILE_CSV =  './data/dianping-parsed.csv';
const GET_CITY_REG = /data-(.+).json/;
const REPEAT_DATA_GLOB = /data-.*?\s*\(\d\).json/;
const CORE_INFO_KEY = '/mapi.dianping.com/mapi/base/unify/shop.bin';


function findRepeatData() {
  const list = glob.sync(TARGET_GLOB);
  console.log('list', list);
  const result = list.filter(item => REPEAT_DATA_GLOB.test(item));
  console.log('重复数据有：', result.join('\n'));
}


function parseDianpingData(cityData, key) {
  const keys = Object.keys(cityData);
  const coreKey = keys.find(item => item.includes(CORE_INFO_KEY));
  const list  = [];
  if (coreKey) {
    const raw = cityData[coreKey].data;
    const coreInfo = {
      name: raw.name,
      lat: raw.lat,
      lng: raw.lng,
      phone: raw.phoneNo,
      priceText: raw.priceText,
      address: raw.address.replace(',', ' '),
      regionName: raw.regionName,
      city: '上海',
      urlKey: key,
    };
    list.push(coreInfo);
  }
  return list;
}

function main() {
  findRepeatData();
  const list = glob.sync(TARGET_GLOB);

  const result = list.reduce((acc, item) => {
    const key = item.match(GET_CITY_REG)[1];
    const cityData = readFileSync(item, true);

    const parsed = parseDianpingData(cityData, key);
    return [
      ...acc,
      ...parsed,
    ];
  }, []);
  console.log('[result.length]', result.length);
  writeFileSync(PARSED_DATA_FILE, result, true);

  const csvData = generateCSVData(result, {
    name: '名称',
    address: '地址',
    city: '城市',
    phone: '电话',
    regionName: '区域',
    lng: 'lng',
    lat: 'lat',
    urlKey: 'urlKey',
  });

  const csv = generateCSV(csvData);
  writeFileSync(PARSED_DATA_FILE_CSV, csv);
}


main();
