const _window = window
let cachedPrefix = _window.localStorage.getItem('_customFilter_projectPrefix')
if (!cachedPrefix) {
  cachedPrefix = _window.prompt('请补全项目代号，之后可以通过 localStorage _customFilter_projectPrefix 来修改。', 'XXX')
  _window.localStorage.setItem('_customFilter_projectPrefix', cachedPrefix || 'XXX')
}

const projectPrefix = cachedPrefix || 'XXX'

export class Context {
  executionIframe
  tW
  projectPrefix
  kanbanRefreshTag

  constructor ({ executionIframe }) {
    this.executionIframe = executionIframe
    this.tW = _window
    this.projectPrefix = projectPrefix
    this.kanbanRefreshTag = false
  }

  get window () {
    return this.executionIframe.contentWindow
  }

  get urlDomain () {
    return this.tW.location.origin
  }

  get _window () {
    return this.tW
  }

  get document () {
    return this.executionIframe.contentWindow.document
  }

  get kanbanRefreshed () {
    return this.kanbanRefreshTag === true
  }
  setKanbanRefreshTag () {
    this.kanbanRefreshTag = true
  }
  resetKanbanRefreshTag () {
    this.kanbanRefreshTag = false
  }

  static of (executionIframe) {
    return new Context({
      executionIframe
    })
  }
}
