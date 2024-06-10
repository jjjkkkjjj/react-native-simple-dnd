import styles from "rollup-plugin-styles";
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import del from 'rollup-plugin-delete';

const autoprefixer = require('autoprefixer');

// import tsConfig from './tsconfig.json';

const conf = [
  {
    input: 'src/index.ts',
    cache: false,
    output: [
      {
        dir: `dist/commonjs`,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
    ],
    // this externelizes react to prevent rollup from compiling it
    external: ["react", /@babel\/runtime/],
    plugins: [
        // these are babel comfigurations
        babel({
            exclude: 'node_modules/**',
            plugins: ['@babel/transform-runtime'],
            babelHelpers: 'runtime'
        }),
        // this adds sourcemaps
        sourcemaps(),
        del({targets:'dist/*'}),
        // this adds support for styles
        styles({
            postcss: {
                plugins: [
                    autoprefixer()
                ]
            }
        }),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                  declarationDir: "dist/commonjs"
                },
            },
            // target: 'es2016',
            exclude: ['./src/**/*.test.ts', './src/**/*.test.tsx']
        })
    ],
  },
  {
    input: 'src/index.ts',
    cache: false,
    output: [
      {
        dir: `dist/es`,
        format: 'es',
        exports: 'named',
        sourcemap: true
      },
    ],
    // this externelizes react to prevent rollup from compiling it
    external: ["react", /@babel\/runtime/],
    plugins: [
        // these are babel comfigurations
        babel({
            exclude: 'node_modules/**',
            plugins: ['@babel/transform-runtime'],
            babelHelpers: 'runtime'
        }),
        // this adds sourcemaps
        sourcemaps(),
        del({targets:'dist/es/*'}),
        // this adds support for styles
        styles({
            postcss: {
                plugins: [
                    autoprefixer()
                ]
            }
        }),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                  declarationDir: "dist/es"
                },
            },
            // target: 'es2016',
            exclude: ['./src/**/*.test.ts', './src/**/*.test.tsx']
        })
    ],
  },
]

export default conf;