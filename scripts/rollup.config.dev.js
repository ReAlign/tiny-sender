import baseConfig from './rollup.config.base';
import serve from 'rollup-plugin-serve';

import transBigHumpName from './trans-big-hump-name';
import getRealName from './get-real-name';

import { name } from '../package.json';

const rName = getRealName(name);
const libName = transBigHumpName(rName);

// console.log(rName, libName);

export default {
  ...baseConfig,
  output: [
    {
      file: `dist/${rName}.min.js`,
      format: 'umd',
      name: libName,
      sourcemap: true,
    },
    {
      file: `dist/${rName}.cjs.min.js`,
      format: 'cjs',
      name: libName,
      sourcemap: 'inline',
    },
    // cjs and esm version
    {
      file: `dist/${rName}.esm.min.js`,
      format: 'es',
      external: ['axios']
    }
  ],
  plugins: [
    ...baseConfig.plugins,
    serve({
      port: 8083,
      contentBase: [''],
    }),
  ],
};
