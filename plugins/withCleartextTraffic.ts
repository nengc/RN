const { ConfigPlugin, withAndroidManifest } = require('expo/config-plugins');

const withCleartextTraffic = (config) => {
  return withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0];
    if (app) {
      // 正确操作 XML 属性的方式
      app.$["android:usesCleartextTraffic"] = "true";
    }
    return config;
  });
};

module.exports = withCleartextTraffic;