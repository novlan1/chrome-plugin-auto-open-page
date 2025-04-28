// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
	checkWatchTimes();
});
const hrefList = []
const justHold = (time) => new Promise(resolve => setTimeout(resolve, time))

async function openAllData() {
  const base = 'https://www.dianping.com/shanghai/ch30/g20042'
  const list = Array.from({length: 50}).map((_, index) => `${base}p${index+1}`).slice(13, 50)
  console.log('list', list)
  return list;
}

async function getListInfo() {
  const list = [...document.querySelectorAll('.shop-all-list ul li')]
  for (const item of list) {
    const pic = item.querySelector('.pic a')
    const href = pic.getAttribute('href').trim();
    console.log('href', href)
    hrefList.push(href)
    await window.open(href)
    await justHold(5000)
  }
  await window.close();
}

async function getDetail() {
  const prefix = 'https://www.dianping.com/shop/'

  const core = document.querySelector('body script').textContent.replace(/window\.__xhrCache__\s*\=\s*/, '')
  console.log('window.getDetail', JSON.parse(core))
  
  const blob = new Blob([core], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const key = window.location.href.replace(prefix, '')
  // 创建下载链接并触发点击
  const a = document.createElement("a");
  a.href = url;
  a.download = `data-${key}.json`;
  a.click();
  await justHold(5000)
  await window.close();
}

const ELEMENTS = {
  NEXT_TASK: '.el-button.el-button--primary.el-button--mini',
  TASK_STATUS:  '.task-status .done-text'
}

let watchTimer = null

function checkFinished() {
  const dom = document.querySelector(ELEMENTS.TASK_STATUS)
  const finished = !!dom
  return finished;
}

async function checkWatchTimes() {
  // const finished = checkFinished();

  if (window.location.href.includes('dianping.com')) {
    try {
      await getDetail();
    } catch(err) {
    }
    try {
      await getListInfo();
    } catch(err) {
    }
    return;
  }

  const list = await openAllData();
  for (const item of list) {
    await window.open(item)
    await justHold(3000)
    await window.close();
  }
}