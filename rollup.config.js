import p from 'path';
import * as fs from 'fs';

import { rollup } from 'rollup';

import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import filesize from 'rollup-plugin-filesize';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

import pack from './package.json';

const devBuild = (process.env && (process.env.NODE_ENV === 'dev')) ||
                 (process.argv[2] === 'dev');
process.env.NODE_ENV = devBuild ? 'dev' : 'prod';

const banner =`/*!
 * ${pack.name} v${pack.version}
 * (c) ${new Date().getFullYear()} ${pack.author || 'unknown'}
 * Released under the ${pack.license} License.
 */`;

const entryFile = pack['jsnext:main'] || 'src/index.js';
const entry = p.resolve(entryFile);

const bundleName = pack.name + (devBuild ? '.js' : '.min.js');
const dest = p.resolve(`dist/${bundleName}`);

const external = ['plask'];

const babelConfig = JSON.parse(fs.readFileSync('.babelrc', 'utf-8'));
babelConfig.babelrc = false;
babelConfig.presets = babelConfig.presets.map((preset) =>
  preset === 'es2015' ? 'es2015-rollup' : preset
);

const plugins = [
  nodeResolve({
    jsnext: true,
    main: true,
    preferBuiltins: true,
    external: [
      'dgram',
      'events'
    ]
  }),
  eslint(),
  babel(babelConfig)
];
if (!devBuild) {
  const uglifyConfig = JSON.parse(fs.readFileSync('.uglifyrc.json', 'utf-8'));
  plugins.push(uglify(uglifyConfig));
}
plugins.push(filesize());

const bundleConfig = {
  dest,
  banner,
  format: 'cjs',
  sourceMap: true
};

Promise.resolve(rollup({ entry, external, plugins }))
       .then(({ write }) => write(bundleConfig));
process.on('unhandledRejection', reason => { console.error(reason); });
