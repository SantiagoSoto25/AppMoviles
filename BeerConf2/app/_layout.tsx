import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Conferencias' }} />
      <Stack.Screen name="detail" options={{ title: 'Detalle' }} />
      <Stack.Screen name="map" options={{ title: 'Mapa' }} />
    </Stack>
  );
}