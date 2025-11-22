// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolve react-native-maps to empty module on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') {
    return {
      filePath: `${__dirname}/empty-module.js`,
      type: 'sourceFile',
    };
  }
  
  // Optional: Also handle the native component imports
  if (platform === 'web' && moduleName.includes('react-native-maps')) {
    return {
      filePath: `${__dirname}/empty-module.js`,
      type: 'sourceFile',
    };
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;