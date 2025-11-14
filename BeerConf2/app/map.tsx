import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -32.4950,
          longitude: -58.2386,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        <Marker coordinate={{ latitude: -32.4950, longitude: -58.2386 }} title="Evento Cervecero" description="Centro de Convenciones" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 }
});