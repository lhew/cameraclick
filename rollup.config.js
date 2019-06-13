import babel from 'rollup-plugin-babel'
// import filesize from 'rollup-plugin-filesize';
// import progress from 'rollup-plugin-progress';
// import visualizer from 'rollup-plugin-visualizer';
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'production'

const config = {
  input: ['src/index.js', 'src/cameraclick.js', 'src/utils.js'],
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    json(),
    // visualizer(),
    // filesize(),
    // progress(),
    terser(),
    resolve({
      browser: true,
      extensions: ['.js']
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    babel({ runtimeHelpers: true })
  ]
}

export default config
