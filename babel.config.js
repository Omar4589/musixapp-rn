module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    // your other plugins...
    '@babel/plugin-transform-export-namespace-from',
  ],
};
