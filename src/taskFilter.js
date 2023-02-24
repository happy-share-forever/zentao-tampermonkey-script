function hiddenTaskWithPrimaryBtn(doc, checkName) {

  const $taskList = $(doc.querySelectorAll('#taskList tbody tr'))
  if (!checkName) {
    $taskList.each(function () {
      $(this).css('display', 'table-row')
    })
    return
  }
  let currentMainTask = null
  let currentMainTaskIndex = -1
  let currentMainTaskNeedShow = false
  $taskList.each(function (index) {
    const $el = $(this)
    if ($el.hasClass('table-children')) {
      // 子任务，只需要判断指派人
      const show = $el.find('.c-assignedTo.has-btn').text().trim() === checkName
      $el.css('display', show ? 'table-row' : 'none')
      if (currentMainTask) {
        const taskId = currentMainTask.attr('data-id')
        if ($el.hasClass(`parent-${taskId}`) && show) currentMainTaskNeedShow = true
      }
    } else {
      // 先判断上一个含子任务的主任务元素存在，需要判断是否需要隐藏
      // 重新赋值当前主任务
      if (currentMainTask) {
        currentMainTask.css('display', (currentMainTaskNeedShow || ((index - currentMainTaskIndex) === 1)) ? 'table-row' : 'none')
      }
      currentMainTask = $el
      currentMainTaskIndex = index
      currentMainTaskNeedShow = false
    }
    // 遍历到最后一个时，最近一个主任务的显隐判断还未完成
    if (index === $taskList.length - 1 && currentMainTask) {
      currentMainTask.css('display', currentMainTaskNeedShow ? 'table-row' : 'none')
    }
  })
}

// 任务列表根据人筛选
export function taskListFilterByRole(doc) {
  const search = window.location.search
  if (!(search.includes('f=task') && (search.includes('type=all') || search.includes('type=unclosed')))) return
  if (doc.querySelector('.custom-filter-box')) return
  const nodeList = $(doc.querySelectorAll('.c-assignedTo.has-btn'))
  const $box = $(doc.createElement('div'))
  $box.addClass('custom-filter-box')
  $(doc.querySelector('#mainMenu')).after($box)
  const btnList = []
  nodeList.each(function () {
    const name = $(this).text().trim()
    if (!btnList.includes(name)) btnList.push(name)
  })
  btnList.forEach(i => {
    const $btnBox = $(doc.querySelector('.custom-filter-box'))
    const $btn = $(doc.createElement('a'))
    $btn.addClass('btn custom-filter-btn')
    $btn.html(i)
    $btn.on('click', function () {
      let checkedName
      const isChecked = $btn.hasClass('btn-primary')
      if (!isChecked) {
        $btn.addClass('btn-primary').siblings().removeClass('btn-primary')
        checkedName = $btn.text().trim()
      } else {
        $btn.removeClass('btn-primary')
        checkedName = ''
      }
      // _window.localStorage.setItem('_taskListFilter_name', checkedName)
      // 隐藏其他行
      hiddenTaskWithPrimaryBtn(doc, checkedName)
    })
    $btn.appendTo($btnBox)
  })
}