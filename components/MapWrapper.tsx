// components/MapWrapper.tsx
import React from 'react';
import { Platform, Text, View } from 'react-native';

const MapWrapper = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text>Map not available on web</Text>
        {/* Optionally, you can use a web-based map solution here */}
      </View>
    );
  }

  const MapView = require('react-native-maps').default;
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
};

export default MapWrapper;