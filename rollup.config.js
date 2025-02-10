import commonjs from '@rollup/plugin-commonjs' // 将非ES6语法的包转为ES6可用
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { URL, fileURLToPath } from 'url'
import fs from 'fs'
import { uglify } from 'rollup-plugin-uglify'
import babel from '@rollup/plugin-babel';
import ts from 'rollup-plugin-typescript2'
const packagePath = fileURLToPath(new URL(`${process.cwd()}/package.json`, import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
const tsPlugin = ts({
  tsconfig: './tsconfig.json', // 导入本地ts配置
  extensions: ['.ts']
})

const rollupConfig = {
  input: './src/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'esm',
      name: packageJson.name,
      sourcemap: false,
      exports: 'auto'
    }
  ],
  plugins: [
    commonjs({
      exclude: [  ]
    }),
    nodeResolve(),
    tsPlugin,
    uglify(),
    babel({ 
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })
  ]
}

export default rollupConfig
