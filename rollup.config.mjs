// Contents of the file /rollup.config.js
import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";
const config = [
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/knotfree-ts-lib.js',
      format: 'cjs',
      sourcemap: true,
    },
    external: ['tweetnacl-ts','fast-sha256','net' ],
    plugins: [typescript()],
    external: ['buffer','tweetnacl-ts','fast-sha256','net' ],
  }, {
    input: 'dist/index.d.ts',
    output: {
      file: 'dist/knotfree-ts-lib.d.ts',
      format: 'es'
    },
    plugins: [dts()],
    
  },
  
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