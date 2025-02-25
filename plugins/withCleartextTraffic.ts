const { ConfigPlugin, withAndroidManifest } = require('@expo/config-plugins');

const withCleartextTraffic = (config) => {
  return withAndroidManifest(config, (config) => {
    if (config.modResults) {
      const manifest = config.modResults.manifest.application ? config.modResults.manifest.application[0] : undefined;
      if (manifest) {
        manifest['android:usesCleartextTraffic'] = 'true';
      }
    }
    return config;
  });
};

module.exports = withCleartextTraffic;
