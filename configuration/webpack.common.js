import url from 'url';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');

export const map = {
  root: ROOT,
  src: path.resolve(ROOT, 'src'),
  dist: path.resolve(ROOT, 'dist'),
  configuration: __dirname,
  test: path.resolve(ROOT, 'test'),
};

export default {
  entry: path.resolve(map.src, 'index.ts'),

  output: {
    filename: 'index.js',
    path: map.dist,
  },

  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(map.configuration, 'tsconfig.json'),
              compilerOptions: {
                include: path.join(map.src, '**/*'),
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },
};
