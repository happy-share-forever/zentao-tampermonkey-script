import { getUserScript } from './src/userScript.js'

export default {
  input: 'main.js',
  output: {
    file: 'dist/ZenTao.user.js',
    format: 'iife',
    banner: getUserScript()
  },
  watch: {
    exclude: ['node_modules/**', 'dist/**']
  }
}
