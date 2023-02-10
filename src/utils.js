export function debounce (fn, delay) {
  let timerID = null
  return function () {
    const context = this
    const args = arguments
    if (timerID) {
      clearTimeout(timerID)
    }
    timerID = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
