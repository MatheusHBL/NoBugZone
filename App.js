import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import PersonalDataForm from './src/components/PersonalDataForm';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <PersonalDataForm />
    </SafeAreaView>
  );
}