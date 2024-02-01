// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{
	checkWatchTimes();
});

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

function checkWatchTimes() {
  const finished = checkFinished();
  console.log('[finished]', finished)

  if (finished) {
    const nextTaskElement = document.querySelector(ELEMENTS.NEXT_TASK);
    nextTaskElement.click();
  }

  clearTimeout(watchTimer)
  watchTimer = setTimeout(() => {
    checkWatchTimes();
  }, 5000)
}