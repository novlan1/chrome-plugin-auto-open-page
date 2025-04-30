const glob = require('glob');
const { readFileSync, writeFileSync, generateCSVData, generateCSV } = require('t-comm');

const TARGET_GLOB = './data/baidu-map/baidu-map-*.json';

const PARSED_DATA_FILE = './data/baidu-map-parsed.json';
const PARSED_DATA_FILE_CSV =  './data/baidu-map-parsed.csv';
const GET_CITY_REG = /baidu-map-(.+).json/;


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
    city: '城市',
    phone: '电话',
  });

  const csv = generateCSV(csvData);
  writeFileSync(PARSED_DATA_FILE_CSV, csv);
}

main();
