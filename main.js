import './src/styleProxy.js'
import { debounce } from './src/utils.js'

const _window = window
const urlDomain = location.origin
let cachedPrefix = _window.localStorage.getItem('_customFilter_projectPrefix')
if (!cachedPrefix) {
  cachedPrefix = _window.prompt('请补全项目代号，之后可以通过 localStorage _customFilter_projectPrefix 来修改。', 'XXX')
  _window.localStorage.setItem('_customFilter_projectPrefix', cachedPrefix || 'XXX')
}

const projectPrefix = cachedPrefix || 'XXX'

function enhanceTask (document) {
  const target = $(document.querySelectorAll('.main-table td.c-actions'))
  if (target.find('span:contains("copy:")').length > 0) return
  target.each(function () {
    const $el = $(this).parent()
    const taskId = $el.attr('data-id') || $el.find('.cell-id').find('a').text()
    const $text = $('<span>copy:</span>')
    $text.appendTo($el.find('.c-actions'))
    const $copyId = $(document.createElement('a'))
    $copyId.html('<span class="text"> 分支</span>')
    $copyId.on('click', function () {
      GM_setClipboard(`feature/${projectPrefix}-${taskId}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyId.appendTo($el.find('.c-actions'))

    // 复制标题
    const $copyTitle = $(document.createElement('a'))
    $copyTitle.html('<span class="text"> 标题</span>')
    $copyTitle.on('click', function () {
      let title = window.location.search.includes('f=bug')
        ? $($el.children()[3]).attr('title')
        : $(document).find(`tr[data-id=${taskId}]`).find('.c-name').attr('title')
      GM_setClipboard(`${projectPrefix}-${taskId} ${title}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyTitle.appendTo($el.find('.c-actions'))

    // 复制链接
    const $copyLink = $(document.createElement('a'))
    $copyLink.html('<span class="text"> 链接</span>')
    $copyLink.on('click', function () {
      GM_setClipboard(`${urlDomain}/index.php?m=task&f=view&taskID=${taskId}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyLink.appendTo($el.find('.c-actions'))
  })
}

function enhanceKanBan (document) {
  const target = $(document.querySelectorAll('.board-story'))
  // 已经添加过了
  if (target.find('a:contains("复制分支")').length > 0) return
  enhanceKanBanStory(target, document);
  enhanceKanBanTask(document);
  enhanceKanBanClosedTaskWithCache(document)
}

function enhanceKanBanStory (target, document) {
  target.each(function () {
    const $el = $(this)
    const $ul = $el.find('ul')
    const storyId = $el.attr('data-id')
    const $copyIdLi = $(document.createElement('li'))
    $copyIdLi.html('<a>复制分支</a>')
    $copyIdLi.on('click', function () {
      GM_setClipboard(`feature/${projectPrefix}-${storyId}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyIdLi.appendTo($ul)

    const $copyTitle = $(document.createElement('li'))
    $copyTitle.html('<a>复制标题</a>')
    $copyTitle.on('click', function () {
      const title = $el.find('.group-title').attr('title')
      GM_setClipboard(`${projectPrefix}-${storyId} ${title}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyTitle.appendTo($ul)

    const $copyLink = $(document.createElement('li'))
    $copyLink.html('<a>复制链接</a>')
    $copyLink.on('click', function () {
      const link = `${urlDomain}/index.php?m=story&f=view&storyID=${storyId}`
      GM_setClipboard(link, { type: 'text', mimetype: 'text/plain' })
    })
    $copyLink.appendTo($ul)

    // hover 增强
    const $dropdown = $el.find('li.dropdown')
    $dropdown.on('mouseover', function () {
      $dropdown.addClass('open')
      $ul.css('margin-top', '-30px')
    }).on('mouseleave', function () {
      $dropdown.removeClass('open')
    })
  })
}

function enhanceKanBanTask (document) {
  const taskInfos = [...document.querySelectorAll('.info')]
  for (const taskInfo of taskInfos) {
    const $taskInfo = $(taskInfo)
    const id = $taskInfo.parent().attr('data-id')
    const $no = $(document.createElement('a'))
    $no.text('#' + id)
    $no.addClass('small')
    $taskInfo.prepend($no)
  }
}

const kanbanDataCache = {}

function enhanceKanBanClosedTaskWithCache (document) {
  const executionID = new URL(_window.location.href).searchParams.get('executionID')
  if (kanbanDataCache[executionID]) {
    enhanceKanBanClosedTask(kanbanDataCache[executionID], document)
  } else {
    debouncedEnhanceKanBanClosedTask(document)
  }
}

const debouncedEnhanceKanBanClosedTask = debounce(queryKanbanAndEnhanceKanBanClosedTask, 100)

function queryKanbanAndEnhanceKanBanClosedTask (document) {
  const executionID = new URL(_window.location.href).searchParams.get('executionID')
  $.get(`${urlDomain}/index.php?m=execution&f=kanban&t=json&executionID=${executionID}`, function (res) {
    const kanbanData = JSON.parse(JSON.parse(res).data)
    kanbanDataCache[executionID] = kanbanData
    enhanceKanBanClosedTask(kanbanData, document)
  })
}

function enhanceKanBanClosedTask (kanbanData, document) {
  const kanbanTasksMap = getKanbanTasksMap(kanbanData)
  const closedTasksMap = getKanbanClosedTaskMap(kanbanTasksMap)
  const tasksDom = [...document.querySelectorAll('.task-assignedTo,.bug-assignedTo')]
  for (const taskDom of tasksDom) {
    const u = new URL(taskDom.parentElement.previousElementSibling.href)
    const taskID = u.searchParams.get('bugID') ? u.searchParams.get('bugID') : u.searchParams.get('taskID')
    if (!closedTasksMap[taskID]) continue
    const kanbanTask = kanbanTasksMap[taskID]
    const $span = $(taskDom).find('span')
    const closerName = kanbanData.realnames[kanbanTask.closedBy]
    $span.text(`Closed(${closerName})`)
    $span.css('max-width', '100px')
  }

  // 增强看板：增加角色过滤器
  enhanceRoleFilter(document)
}

function getKanbanTasksMap (kanbanData) {
  const kanbanTasks = Object.values(kanbanData.stories).map(a => a.tasks).filter(a => a).flatMap(a => Object.values(a)).flatMap(a => a)
    .concat(Object.values(kanbanData.stories).map(a => a.bugs).filter(a => a).flatMap(a => Object.values(a)).flatMap(a => a))
    .concat(Object.values(kanbanData.kanbanGroup).map(a => a.tasks).filter(a => a).flatMap(a => Object.values(a)).flatMap(a => a))
    .concat(Object.values(kanbanData.kanbanGroup).map(a => a.bugs).filter(a => a).flatMap(a => Object.values(a)).flatMap(a => a))
  const kanbanTasksMap = {}
  kanbanTasks.forEach(task => kanbanTasksMap[task.id] = task)
  return kanbanTasksMap
}

function getKanbanClosedTaskMap (kanbanTasksMap) {
  const closedTasks = Object.values(kanbanTasksMap).filter(a => a.status && a.status === 'closed')
  const closedTasksMap = {}
  closedTasks.forEach(task => closedTasksMap[task.id] = task)
  return closedTasksMap
}

function enhanceDialog (mutationsList) {
  mutationsList.forEach(item => {
    if (item.addedNodes.length > 0) {
      const firstChild = $(item.addedNodes[0])
      if (firstChild.attr('id') === 'iframe-triggerModal') {
        // 任务详情弹窗
        firstChild.off('load').on('load', function () {
          const doc = firstChild[0].contentWindow.document
          enhanceHistoryList(doc)
          const toolbar = $(doc.querySelector('.main-actions > .btn-toolbar'))

          // 复制分支
          const $copyId = $(document.createElement('a'))
          $copyId.addClass('btn btn-link showinonlybody')
          $copyId.html('<span class="text"></span> 复制分支')
          const taskId = $(doc.querySelector('.page-title > span.label-id')).text()
          $copyId.on('click', function () {
            GM_setClipboard(`feature/${projectPrefix}-${taskId}`, { type: 'text', mimetype: 'text/plain' })
          })
          $copyId.appendTo(toolbar)

          // 复制标题
          const $copyTitle = $(document.createElement('a'))
          $copyTitle.addClass('btn btn-link showinonlybody')
          $copyTitle.html('<span class="text"></span> 复制标题')
          $copyTitle.on('click', function () {
            const title = $(doc.querySelector('.page-title > span.text')).attr('title')
            GM_setClipboard(`${projectPrefix}-${taskId} ${title}`, { type: 'text', mimetype: 'text/plain' })
          })
          $copyTitle.appendTo(toolbar)

          // 复制链接
          const $copyLink = $(document.createElement('a'))
          $copyLink.addClass('btn btn-link showinonlybody')
          $copyLink.html('<span class="text"></span> 复制链接')
          $copyLink.on('click', function () {
            GM_setClipboard(`${urlDomain}/index.php?m=task&f=view&taskID=${taskId}`, { type: 'text', mimetype: 'text/plain' })
          })
          $copyLink.appendTo(toolbar)

        })
      }
    }
  })
}

function hiddenBoardItemWithPrimaryBtn (doc) {
  const roleFilterBtnArr = $.makeArray($(doc).find('.btn.custom-filter-btn.btn-primary'))
  const allBoardList = $(doc.querySelectorAll('.board-item'))
  allBoardList.each(function () {
    const $item = $(this)
    if (isAllText(roleFilterBtnArr)) {
      $item.css('display', 'block')
    } else {
      const assignedTo = $($item.find('.task-assignedTo,.bug-assignedTo').children()[1]).text().trim()
      const isNotClosed = roleFilterBtnArr.map(e => $(e).text().trim()).includes(NOT_CLOSED)
      const roles = isNotClosed ? roleFilterBtnArr.filter(e => $(e).text().trim() !== NOT_CLOSED) : roleFilterBtnArr
      let isDisplay = roles.every(b => {
        return assignedTo.includes($(b).text().trim())
      })
      if (isDisplay && isNotClosed) {
        isDisplay = !assignedTo.includes('Closed')
      }
      if (isDisplay) {
        $item.css('display', 'block')
      } else {
        $item.css('display', 'none')
      }
    }
  })

  // 隐藏空行
  $(doc.querySelectorAll('tr[data-id]')).each(function () {
    const $tr = $(this)
    let hasTask = false
    $tr.children().find('.board-item').each(function () {
      if ($(this).css('display') === 'block') {
        hasTask = true
      }
    })
    if (!hasTask && roleFilterBtnArr.length && !isAllText(roleFilterBtnArr)) {
      $tr.css('display', 'none')
    } else {
      $tr.css('display', 'table-row')
    }
  })
}

function isAllText (btnArr) {
  return btnArr.some(b => {
    const trim = $(b).text().trim()
    return !trim || trim === ALL_TEXT
  })
}

const ALL_TEXT = '全部'
const NOT_CLOSED = '未关闭'
const CN_REG = /[^\x00-\xff]+/gm // 过滤中文字符的正则

class Button {
  constructor (name, exclusiveList) {
    this.name = name
    this.exclusiveList = exclusiveList
  }
}

function enhanceRoleFilter (doc) {
  if (!window.location.search.includes('kanban')) return
  if (doc.querySelectorAll('.custom-filter-btn').length) {
    hiddenBoardItemWithPrimaryBtn(doc)
    return
  }
  const btnList = []
  $(doc.querySelectorAll('.task-assignedTo,.bug-assignedTo')).each(function () {
    const ssignedTo = $(this).text().trim()
    const matches = ssignedTo.match(CN_REG)
    if (!matches) return
    const name = matches[0]
    if (!btnList.map(b => b.name).includes(name)) btnList.push(new Button(name, [0]))
  })
  btnList.sort()
  btnList.unshift(new Button(NOT_CLOSED, [1]))
  btnList.unshift(new Button(ALL_TEXT, [0, 1]))

  const $mainMenu = $(doc.querySelector('#mainMenu'))
  btnList.forEach(i => {
    const $btn = $(doc.createElement('a'))
    $btn.addClass('btn custom-filter-btn')
    if (i.name.includes(ALL_TEXT)) {
      $btn.addClass('all-button')
    }
    $btn.css('margin-right', '10px')
    $btn.html(i.name)
    $btn.on('click', function () {
      const isChecked = $btn.hasClass('btn-primary')
      if (isChecked) {
        $btn.removeClass('btn-primary')
      } else {
        $.makeArray($btn.addClass('btn-primary').siblings('a'))
          .filter(e => btnList.find(b => b.name === $(e).text()).exclusiveList.filter(v => i.exclusiveList.includes(v)).length > 0)
          .forEach(e => $(e).removeClass('btn-primary'))
      }
      const checkedNames = $.makeArray($(doc).find('.btn-primary.custom-filter-btn')).map(e => e.text)
      if (!checkedNames || !checkedNames.length) {
        // 如果没选中任何条件，则默认选中“全部”
        $(doc).find('.all-button').click()
      }
      _window.localStorage.setItem('_customerFilter_name', JSON.stringify(checkedNames))
      hiddenBoardItemWithPrimaryBtn(doc)
    })
    $btn.appendTo($mainMenu)
  })
  const checkedNames = JSON.parse(_window.localStorage.getItem('_customerFilter_name'))
  if (checkedNames && checkedNames.length > 0) {
    if (!checkedNames.every(c => btnList.map(b => b.name).includes(c))) {
      _window.localStorage.setItem('_customerFilter_name', '')
      return
    }
    $(doc).find('.btn.custom-filter-btn').each((index, item) => {
      const $item = $(item)
      checkedNames.forEach(c => {
        if ($item.text().trim() === c) {
          $item.click()
        }
      })
    })
  }
}

// 历史记录只展示备注
function enhanceHistoryList (doc) {
  if (doc.querySelectorAll('.histories-custom-filter-btn').length) return
  const fn = function (type) {
    $(doc.querySelectorAll('.histories-list li')).each(function () {
      const $this = $(this)
      if (type === 'hide' && $this.text().indexOf('备注') === -1) {
        $this.hide()
      } else {
        $this.show()
      }
    })
  }
  const $titleBox = $(doc.querySelector('.histories .detail-title'))
  const $hideBtn = $(doc.createElement('a'))
  $hideBtn.addClass('btn btn-link pull-right histories-custom-filter-btn')
  $hideBtn.html('只看备注')
  $hideBtn.on('click', function () {
    if ($hideBtn.html() === '只看备注') {
      fn('hide')
      $hideBtn.html('查看全部')
    } else {
      fn('show')
      $hideBtn.html('只看备注')
    }
  })
  $hideBtn.appendTo($titleBox)
}

// 任务弹窗关闭后 iframe 重新 reload了，所以需要监听
const executionIframe = document.querySelector('#appIframe-execution')
if (executionIframe) {
  executionIframe.onload = function () {
    setTimeout(() => executionIframe.contentWindow.dispatchEvent(new Event('resize')), 500)
    const doc = executionIframe.contentWindow.document
    enhanceTask(doc)
    enhanceKanBan(doc)
    enhanceHistoryList(doc)
    const observer = new MutationObserver((mutationsList) => {
      enhanceTask(doc)
      enhanceKanBan(doc)
      enhanceDialog(mutationsList)
      enhanceHistoryList(doc)
    })
    observer.observe(doc.body, {
      childList: true,
      subtree: true
    })
  }
}

