import { getUserScript } from './src/userScript.js'

export default {
  input: 'main.js',
  output: {
    file: 'dist/zentao.user.js',
    format: 'iife'
  },
  plugins: [
    {
      banner() {
        return getUserScript()
      }
    }
  ]
}
