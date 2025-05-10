import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import NoBugZoneForm from './src/components/NoBugZoneForm';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <NoBugZoneForm />
    </SafeAreaView>
  );
}