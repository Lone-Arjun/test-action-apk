import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://builderengine.vercel.app/login' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
