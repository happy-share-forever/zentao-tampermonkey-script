import { enhanceHistoryList } from './enhanceHistoryList.js'
import { Context } from './class/Context.js'

export function enhanceDialog (mutations, ctx) {
  const document = ctx.document
  mutations.forEach(item => {
    if (item.addedNodes.length > 0) {
      const firstChild = $(item.addedNodes[0])
      if (firstChild.attr('id') === 'iframe-triggerModal') {
        // 任务详情弹窗
        firstChild.off('load').on('load', function () {
          const doc = firstChild[0].contentWindow.document
          enhanceHistoryList(Context.of(firstChild[0]))
          const toolbar = $(doc.querySelector('.main-actions > .btn-toolbar'))

          // 复制分支
          const $copyId = $(document.createElement('a'))
          $copyId.addClass('btn btn-link showinonlybody')
          $copyId.html('<span class="text"></span> 复制分支')
          const taskId = $(doc.querySelector('.page-title > span.label-id')).text()
          $copyId.on('click', function () {
            GM_setClipboard(`feature/${ctx.projectPrefix}-${taskId}`, { type: 'text', mimetype: 'text/plain' })
          })
          $copyId.appendTo(toolbar)

          // 复制标题
          const $copyTitle = $(document.createElement('a'))
          $copyTitle.addClass('btn btn-link showinonlybody')
          $copyTitle.html('<span class="text"></span> 复制标题')
          $copyTitle.on('click', function () {
            const title = $(doc.querySelector('.page-title > span.text')).attr('title')
            GM_setClipboard(`${ctx.projectPrefix}-${taskId} ${title}`, { type: 'text', mimetype: 'text/plain' })
          })
          $copyTitle.appendTo(toolbar)

          // 复制链接
          const $copyLink = $(document.createElement('a'))
          $copyLink.addClass('btn btn-link showinonlybody')
          $copyLink.html('<span class="text"></span> 复制链接')
          $copyLink.on('click', function () {
            const textContent = doc.querySelector('.tabs').textContent
            console.log('textContent', textContent)
            if (textContent.indexOf('任务的一生') !== -1) {
              GM_setClipboard(`${ctx.urlDomain}/index.php?m=task&f=view&taskID=${taskId}`, { type: 'text', mimetype: 'text/plain' })
            } else if (textContent.indexOf('Bug类型') !== -1) {
              GM_setClipboard(`${ctx.urlDomain}/index.php?m=bug&f=view&bugID=${taskId}`, { type: 'text', mimetype: 'text/plain' })
            } else {
              GM_setClipboard(`${ctx.urlDomain}/index.php?m=story&f=view&storyID=${taskId}`, { type: 'text', mimetype: 'text/plain' })
            }
          })
          $copyLink.appendTo(toolbar)

        })
      }
    }
  })
}
