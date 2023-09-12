import { ALL_TEXT } from './constants.js'

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

export function isAllText (btnArr) {
  return btnArr.some(b => {
    const trim = $(b).text().trim()
    return !trim || trim === ALL_TEXT
  })
}
export function delay (fn, delay = 200) {
  setTimeout(fn, delay)
}
