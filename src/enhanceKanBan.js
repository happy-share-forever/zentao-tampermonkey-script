export function enhanceKanBanStory (target, ctx) {
  const projectPrefix = ctx.projectPrefix
  const document = ctx.document
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
