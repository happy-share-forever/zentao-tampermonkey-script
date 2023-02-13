export function enhanceTask (ctx) {
  const document = ctx.document
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
      GM_setClipboard(`feature/${ctx.projectPrefix}-${taskId}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyId.appendTo($el.find('.c-actions'))

    // 复制标题
    const $copyTitle = $(document.createElement('a'))
    $copyTitle.html('<span class="text"> 标题</span>')
    $copyTitle.on('click', function () {
      let title = window.location.search.includes('f=bug')
        ? $($el.children()[3]).attr('title')
        : $(document).find(`tr[data-id=${taskId}]`).find('.c-name').attr('title')
      GM_setClipboard(`${ctx.projectPrefix}-${taskId} ${title}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyTitle.appendTo($el.find('.c-actions'))

    // 复制链接
    const $copyLink = $(document.createElement('a'))
    $copyLink.html('<span class="text"> 链接</span>')
    $copyLink.on('click', function () {
      GM_setClipboard(`${ctx.urlDomain}/index.php?m=task&f=view&taskID=${taskId}`, { type: 'text', mimetype: 'text/plain' })
    })
    $copyLink.appendTo($el.find('.c-actions'))
  })
}
