const staticFiles = require('../config/webpack/static-files')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions'
  ],
  webpackFinal: config => {
      // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
      const fileLoaderRule = config.module.rules.find(rule => rule.test && rule.test.test('.svg'));
      fileLoaderRule.exclude = /\.svg$/;

      config.module.rules.push({
        test: /\.svg$/,
        enforce: 'pre',
        loader: require.resolve('@svgr/webpack'),
      });
      config.node = {
          dgram: 'empty',
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
          child_process: 'empty',
      }

      const copyPlugin = new CopyPlugin(staticFiles.copyPatterns)
      config.plugins.push(copyPlugin)

      return config;
  }
};
