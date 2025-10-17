import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Routes from './src/navigation/Routes';
import { colors, fontSize, fonts, wp } from './src/constants/Constants';
// import SplashScreen from 'react-native-splash-screen'
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/Store';
import { PersistGate } from 'redux-persist/integration/react';
import ToastComponent, { BaseToast } from 'react-native-toast-message';

const toastConfig = {
  info: props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.primary }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: fontSize.m,
        fontWeight: 'bold',
        color: colors.primary,
      }}
      text2Style={{
        fontSize: fontSize.s,
        color: colors.darkGrey,
      }}
    />
  ),
};

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      StatusBar.setHidden(false);
      // SplashScreen.hide()
    }, 500);
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <StatusBar
              animated={true}
              backgroundColor={colors.bg}
              barStyle={'dark-content'}
            />
            <SafeAreaProvider>
              {/* <Text>sdasdasd</Text> */}
              <Routes />
            </SafeAreaProvider>
          </View>
        </PersistGate>
      </Provider>
      <ToastComponent
        autoHide={false}
        visibilityTime={7000}
        config={toastConfig}
      />
    </>
  );
};

export default App;
