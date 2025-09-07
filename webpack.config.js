const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Ensure we're targeting web
      platform: 'web',
    },
    argv
  );

  // Configure dev server to use port 5000 and bind to all hosts
  if (config.devServer) {
    config.devServer.port = 5000;
    config.devServer.host = '0.0.0.0';
  } else {
    config.devServer = {
      port: 5000,
      host: '0.0.0.0',
    };
  }

  return config;
};