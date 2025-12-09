import { Linking, Alert, Platform, PermissionsAndroid } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import messaging, { getMessaging } from '@react-native-firebase/messaging';

// Open App Settings
const openAppSettings = () => {
  Linking.openSettings().catch(() =>
    console.warn('Unable to open app settings'),
  );
};

// ------------------ Location Permission ------------------
export const LocationRequest = async () => {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
    Alert.alert(
      'Unsupported Platform',
      'This functionality is only available on Android and iOS.',
    );
    return 'unsupported_platform';
  }

  try {
    let granted;

    if (Platform.OS === 'android') {
      granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
      granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }

    if (granted === RESULTS.GRANTED) return 'granted';
    if (granted === RESULTS.DENIED) {
      Alert.alert(
        'Permission Denied',
        'Location permission is denied. Enable it in settings.',
        [
          {
            text: 'Open Settings',
            onPress: openAppSettings,
            style: 'destructive',
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return 'denied';
    }
    if (granted === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Location permission is blocked. Enable it in settings.',
        [
          {
            text: 'Open Settings',
            onPress: openAppSettings,
            style: 'destructive',
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return 'blocked';
    }

    return 'unknown';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return 'error';
  }
};

// ------------------ Notification Permission ------------------
export const NotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'App needs permission to send you notifications.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      switch (granted) {
        case PermissionsAndroid.RESULTS.GRANTED:
          return 'granted';
        case PermissionsAndroid.RESULTS.DENIED:
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          console.log('Notification permission denied or blocked');
          openAppSettings();
          return 'denied';
        default:
          return 'unknown';
      }
    } catch (err) {
      console.warn('Notification permission request failed:', err);
      openAppSettings();
      return 'error';
    }
  } else {
    // iOS & Android < 33
    const status = await getMessaging().requestPermission();

    switch (status) {
      case messaging.AuthorizationStatus.AUTHORIZED:
        return 'granted';
      case messaging.AuthorizationStatus.PROVISIONAL:
        console.log('Provisional notification permission granted');
        return 'provisional';
      default:
        console.log('Notification permission disabled');
        openAppSettings();
        return 'denied';
    }
  }
};
