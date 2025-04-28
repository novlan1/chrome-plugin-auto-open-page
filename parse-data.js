const fs = require('fs')
const jsonPath = '/Users/guowangyang/Downloads/data (2).json'
const CORE_INFO_KEY = '/mapi.dianping.com/mapi/base/unify/shop.bin'


function parseJson() {
  const json = require(jsonPath)
  const keys = Object.keys(json);
  const coreKey = keys.find(item => item.includes(CORE_INFO_KEY))
  let coreInfo  ={}
  if(coreKey) {
    const raw = json[coreKey].data
    coreInfo = {
      name: raw.name,
      lat: raw.lat,
      lng: raw.lng,
      phone: raw.phoneNo,
      priceText: raw.priceText,
      address: raw.address,
      regionName: raw.regionName,
    }
  }
  console.log('coreInfo', coreInfo)
}

parseJson()