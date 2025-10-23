import { SafeAreaView, Platform, StatusBar } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Constants';
import Header from '../../components/Header';
import { useFocusEffect } from '@react-navigation/native';
import WebView from 'react-native-webview';

export default function AboutUs() {
  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header heading={'About Us'} />
      <WebView
        source={{
          uri: 'https://admin.nutrabioticsapp.com/get-about-us',
        }}
        containerStyle={styles.webviewContainer}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  webviewContainer: {
    height: '100%',
    width: '100%',
  },
});
