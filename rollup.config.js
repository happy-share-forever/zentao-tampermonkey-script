import { getUserScript } from './src/userScript.js'

export default {
  input: 'main.js',
  output: {
    file: 'dist/zentao.user.js',
    format: 'iife'
  },
  watch: {
    exclude: ['node_modules/**', 'dist/**']
  },
  plugins: [
    {
      banner() {
        return getUserScript()
      }
    }
  ]
}
