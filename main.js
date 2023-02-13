import './src/styleProxy.js'
import { Context } from './src/class/Context.js'
import { enhanceHistoryList } from './src/enhanceHistoryList.js'
import { enhanceTask } from './src/enhanceTask.js'
import { enhanceKanBan } from './src/enhanceKanBan.js'
import { enhanceDialog } from './src/enhanceDialog.js'

const executionIframe = document.querySelector('#appIframe-execution')
if (executionIframe) {
  const ctx = Context.of(executionIframe)
  executionIframe.onload = function () {
    setTimeout(() => ctx.window.dispatchEvent(new Event('resize')), 500)
    const doc = ctx.document
    enhanceTask(ctx)
    enhanceKanBan(ctx)
    enhanceHistoryList(ctx)
    const observer = new MutationObserver((mutationsList) => {
      enhanceTask(ctx)
      enhanceKanBan(ctx)
      enhanceDialog(mutationsList, ctx)
      enhanceHistoryList(ctx)
    })
    observer.observe(doc.body, {
      childList: true,
      subtree: true
    })
  }
}

