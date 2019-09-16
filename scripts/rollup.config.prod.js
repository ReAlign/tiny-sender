import filesize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

import transBigHumpName from './trans-big-hump-name';
import getRealName from './get-real-name';

import baseConfig from './rollup.config.base';
import {
  name,
  version,
  author,
  license
} from '../package.json';

const rName = getRealName(name);
const libName = transBigHumpName(rName);

// banner
const banner =
  `${'/*!\n' + ' * '}${rName}.js V ${version}\n` +
  ` * (c) ${new Date().getFullYear()} ${author}\n` +
  ` * Released under the ${license} License.\n` +
  ` */`;

// 支持输出 []
export default [
  // .js, .cjs.js, .esm.js
  {
    ...baseConfig,
    output: [
      // umd with compress version
      {
        file: `dist/${rName}.min.js`,
        format: 'umd',
        name: libName,
        banner,
      },
      // cjs and esm version
      {
        file: `dist/${rName}.cjs.min.js`,
        format: 'cjs',
        banner,
      },
      // cjs and esm version
      {
        file: `dist/${rName}.esm.min.js`,
        format: 'es',
        banner,
      }
    ],
    plugins: [
      ...baseConfig.plugins,
      uglify(
        {
          compress: {
            drop_console: true,
          },
          // ↓ 不混淆其中某个变量名，其他变量名混淆
          mangle: {
            reserved: [
              // 'Event'
            ],
          }
        },
        minify,
      ),
      filesize(),
    ],
  },
];
