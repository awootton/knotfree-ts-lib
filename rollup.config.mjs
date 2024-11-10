// Contents of the file /rollup.config.js
import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";
const config = [
  {
    input: 'build/compiled/index.js',
    //input: 'dist/index.js',
    output: {
      file: 'build/compiled/knotfree-ts-lib.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['tweetnacl-ts','fast-sha256','net' ],
    plugins: [typescript()]
  }, {
    input: 'build/compiled/index.d.ts',
    // input: 'dist/index.d.ts',
    output: {
      file: 'build/compiled/knotfree-ts-lib.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];
export default config;




// import typescript from '@rollup/plugin-typescript'

// export default {
// 	input: 'src/index.ts',
// 	output: {
// 		dir: 'output',
// 		format: 'cjs'
// 	},
//     plugins: [typescript()]
// };

// rollup.config.js

// export default {
//   input: 'src/index.ts',
//   output: {
//     dir: 'output',
//     format: 'cjs'
//   },
//   plugins: [typescript()]
// };