import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssVariables from 'postcss-css-variables'
import postcssFocusVisible from 'postcss-focus-visible'
import scrollbar from 'postcss-scrollbar'
import sass from 'sass'
import url from '@rollup/plugin-url'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const extensions = ['.js', '.ts']

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  nodeResolve({ extensions, browser: true, preferBuiltins: false }),
  commonjs(),
  babel({
    extensions,
    include: ['src/**/*'],
    babelHelpers: 'runtime',
    presets: ['@babel/typescript', '@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime'],
  }),
  postcss({
    preprocessor: (_, id) => async () => ({
      code: sass.compile(id).css.toString(),
    }),
    plugins: [
      autoprefixer(),
      cssVariables({ preserve: true }),
      postcssFocusVisible,
      scrollbar,
    ],
    extract: true,
    minimize: true,
    extensions: ['.scss', '.css'],
  }),
  url(),
  json(),
  terser()
]

if(isDev){
  plugins.push(
    serve({ contentBase: './public', port: 3000 }),
    livereload('public')
  )
}


export default [
  {
    input: 'src/ts/index.ts',
    output: {
      file: 'public/bundle.js',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    plugins
  },
]
