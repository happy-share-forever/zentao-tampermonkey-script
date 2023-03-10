/**
 * 历史记录只展示备注
 * @param {Context} ctx
 */
export function enhanceHistoryList (ctx) {
  const doc = ctx.document
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
  $hideBtn.html('查看全部')
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
  // 默认查看
  fn('hide')
}
