const glob = require('glob');
const { readFileSync, writeFileSync, generateCSVData, generateCSV } = require('t-comm');

const TARGET_GLOB = './data/dianping/data-*.json';

const PARSED_DATA_FILE = './data/dianping-parsed.json';
const PARSED_DATA_FILE_CSV =  './data/dianping-parsed.csv';
const GET_CITY_REG = /dianping-(.+).json/;
const REPEAT_DATA_GLOB = /.*?-（\d).json/;


function findRepeatData() {}


function main() {

}


main();
