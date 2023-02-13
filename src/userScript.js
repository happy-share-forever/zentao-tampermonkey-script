import pkg from '../package.json' assert { type: "json" }

export const getUserScript = () => `// ==UserScript==
// @name         ZenTao
// @namespace    https://iin.ink
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @include      /^https:\\/\\/zentao.*$/
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==
        `
