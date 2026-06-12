module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'], // <-- YOU JUST NEED TO ADD THIS LINE
  };
};