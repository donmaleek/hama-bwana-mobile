// empty-module.js - Located in project root
module.exports = {
  // Default export
  default: () => null,
  
  // Named exports that react-native-maps uses
  Marker: () => null,
  Polyline: () => null,
  Polygon: () => null,
  Circle: () => null,
  Overlay: () => null,
  Callout: () => null,
  Heatmap: () => null,
  UrlTile: () => null,
  WMSTile: () => null,
  LocalTile: () => null,
  MapView: () => null,
  
  // Constants
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default',
  
  // Methods (if any are called)
  setNativeProps: () => {},
  getCamera: () => Promise.resolve(),
  animateCamera: () => Promise.resolve(),
  animateToNavigation: () => Promise.resolve(),
  animateToRegion: () => Promise.resolve(),
  animateToCoordinate: () => Promise.resolve(),
  animateToBearing: () => Promise.resolve(),
  animateToViewingAngle: () => Promise.resolve(),
  fitToElements: () => Promise.resolve(),
  fitToSuppliedMarkers: () => Promise.resolve(),
  fitToCoordinates: () => Promise.resolve(),
  pointForCoordinate: () => Promise.resolve(),
  coordinateForPoint: () => Promise.resolve(),
  
  // Add any other exports that might be used
};