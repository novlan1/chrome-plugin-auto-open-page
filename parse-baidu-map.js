const glob = require('glob');
const { readFileSync, writeFileSync, generateCSVData, generateCSV } = require('t-comm');

const TARGET_GLOB = './data-2025-04-30/baidu-map/baidu-map-*.json';

const PARSED_DATA_FILE = './data-2025-04-30/baidu-map-parsed.json';
const PARSED_DATA_FILE_CSV =  './data-2025-04-30/baidu-map-parsed.csv';
const CITY_PROVINCE_JSON_FILE = './city-province.json';
const GET_CITY_REG = /baidu-map-(.+).json/;

const CITY_PROVINCE_JSON = readFileSync(CITY_PROVINCE_JSON_FILE, true);


function parseBaiduData(list, city) {
  return list
    .filter(item => item)
    .map((item) => {
      const { name, phone } = item;
      return {
        ...item,
        name,
        city,
        phone: phone.replace(/^电话:/, ''),
        province: CITY_PROVINCE_JSON[city],
      };
    });
}


function main() {
  const list = glob.sync(TARGET_GLOB);
  // console.log('list', list);

  const result = list.reduce((acc, item) => {
    const city = item.match(GET_CITY_REG)[1];
    const cityData = readFileSync(item, true);

    const parsed = parseBaiduData(cityData, city);
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
    phone: '电话',
    city: '城市',
    province: '省份',
  });

  const csv = generateCSV(csvData);
  writeFileSync(PARSED_DATA_FILE_CSV, csv);
}

main();
