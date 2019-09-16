import path from 'path';
import alias from 'rollup-plugin-alias';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import json from 'rollup-plugin-json';
import less from 'rollup-plugin-less';

const pathResolve = p => path.resolve(__dirname, '..', p);


export default {
  input: 'src/main.js',
  plugins: [
    less({
      insert: true,
    }),
    alias({
      resolve: ['.js'],
      '@': pathResolve('src'),
      'lib': pathResolve('src/lib'),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    json({
      include: 'node_modules/axios/package.json'
    }),
    resolve(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      // include: 'node_modules/**'
    }),
    eslint({
      include: ['src/**/*.js']
    }),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**' // only transpile our source code
    }),
    globals(),
    builtins(),
  ]
}
