const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');
const jest = require('@neutrinojs/jest');
const { DefinePlugin } = require('webpack');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb({
      eslint: {
        baseConfig: {
          extends: ['prettier'],
          plugins: ['import'],
          globals: {
            __DEV__: false,
            __TEST__: false,
            __PROD__: false,
            __COVERAGE__: false,
            __CONF__: false,
          },
          rules: {
            'react/jsx-filename-extension': 0,
            'jsx-a11y/label-has-associated-control': 0,
            'jsx-a11y/click-events-have-key-events': 0,
            'jsx-a11y/anchor-is-valid': 0,
            'import/prefer-default-export': 0,
            'import/no-cycle': 0,
            'import/no-extraneous-dependencies': [
              'error',
              {
                devDependencies: true,
                optionalDependencies: true,
                peerDependencies: true,
              },
            ],
            'no-unused-vars': [
              'warn',
              {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: false,
              },
            ],
          },
          settings: {
            'import/resolver': {
              webpack: {
                config: 'webpack.config.js',
              },
              alias: [
                ['models', './src/models'],
                ['components', './src/components'],
                ['utils', './src/utils'],
                ['api', './src/api'],
                ['router', './src/router'],
                ['routes', './src/routes'],
                ['orm', './src/orm'],
                ['src', './src'],
                ['hoc', './src/hoc'],
                ['hooks', './src/utils/hooks'],
                ['consts', './src/consts'],
                ['store', './src/store'],
                ['assets', './static/assets'],
                ['environments', './environments'],
              ],
            },
          },
        },
      },
    }),
    react({
      html: {
        title: 'Service Line',
      },
      style: {
        test: /\.(css|sass|scss)$/,
        modulesTest: /\.module\.(css|sass|scss)$/,
        loaders: [
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          {
            loader: 'sass-loader',
            useId: 'sass',
            options: {
              sassOptions: {
                includePaths: ['./src/**/*'],
              },
            },
          },
        ],
      },
      babel: {
        plugins: [
          '@babel/transform-runtime',
          '@babel/plugin-proposal-optional-chaining',
          [
            '@babel/plugin-proposal-object-rest-spread',
            {
              useBuiltIns: false,
            },
          ],
          [
            'module-resolver',
            {
              root: ['./src'],
              alias: {
                test: './test',
                underscore: 'lodash',
              },
            },
          ],
        ],
      },
    }),
    jest(),
    neutrino => {
      neutrino.config.plugin('constants').use(DefinePlugin, [
        {
          __DEV__: JSON.stringify(process.env.NODE_ENV || 'true'),
          __CONF__: JSON.stringify({
            reduxLogger: false,
            api: {
              baseUrl: 'http://localhost:8000/',
            },
          }),
        },
      ]);
    },
  ],
};
