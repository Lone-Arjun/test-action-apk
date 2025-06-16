import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  if (isConnected === null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Checking network...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.centered}>
        <Text style={styles.offlineText}>You're Offline</Text>
        <Text style={styles.text}>Please check your internet connection</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: 'https://builderengine.vercel.app/login' }}
      startInLoadingState={true}
      renderLoading={() => (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Text style={styles.text}>Loading...</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  offlineText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10
  },
  text: {
    fontSize: 16
  }
});
