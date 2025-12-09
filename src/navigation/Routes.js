import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer, useLinkTo } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthRoutes from './AuthRoutes';
import BottomTab from './BottomTab';
import AllProducts from '../screens/OtherScreens/AllProducts';
import Notifications from '../screens/OtherScreens/Notifications';
import Coupens from '../screens/OtherScreens/Coupens';
import ProDetail from '../screens/OtherScreens/ProDetail';
import PharmacyProDetail from '../screens/OtherScreens/PharmacyProDetail';
import ChangePassword from '../screens/OtherScreens/ChangePassword';
import { configureDefaultHeaders } from '../constants/Api';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {
  addNewNotification,
  getAllNotifications,
  notificationSeen,
} from '../redux/actions/NotificationActions';
import ApprovalModal from '../components/ApprovalModal';
import HowToOrder from '../screens/OtherScreens/HowToOrder';
import Search from '../screens/OtherScreens/Search';
import PrivacyPolicy from '../screens/OtherScreens/PrivacyPolicy';
import TermsConditions from '../screens/OtherScreens/TermsConditions';
import ExpiredModal from '../components/ExpiredModal';
import AboutUs from '../screens/OtherScreens/AboutUs';
import NotificationPermission from '../Utils/Permisions';

let unsubscribeOnMessage,
  unsubscribeBackgroundMessageHandler,
  unsubscribeOnNotificationOpenedApp;
const Stack = createNativeStackNavigator();
const linking = {
  prefixes: ['nutrabiotics://'],
  config: {
    screens: {
      ProDetail: 'pro_detail/:id',
    },
  },
};

const Routes = () => {
  const userData = useSelector(state => state.UserReducer);
  const [approvalModal, setApprovalModal] = useState(false);
  const [approvalModalData, setApprovalModalData] = useState(null);
  const [expiredModal, setExpiredModal] = useState(false);
  const [expiredModalData, setExpiredModalData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const initNotifications = async () => {
      if (!userData) return;
      console.log('useefect');
      // 1. Configure API headers
      configureDefaultHeaders(userData?.token);
      dispatch(getAllNotifications(userData?.id));

      // 2. Request notification permission
      const permissionStatus = await NotificationPermission();
      console.log('Notification permission status:', permissionStatus);

      if (
        permissionStatus === 'granted' ||
        permissionStatus === 'provisional'
      ) {
        // 3. Only if permission granted, setup listeners
        listener();
      } else {
        console.log('Notifications not allowed');
      }
    };

    initNotifications();

    return () => {
      // Clean up listeners
      unsubscribeOnMessage && unsubscribeOnMessage();
      unsubscribeBackgroundMessageHandler &&
        unsubscribeBackgroundMessageHandler();
      unsubscribeOnNotificationOpenedApp &&
        unsubscribeOnNotificationOpenedApp();
    };
  }, [userData]);

  const formatNotificationData = notification => {
    let date = new Date(notification?.created_at);
    date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    // if (notification.title == 'Deal') {
    //   notification = {
    //     id: notification?.notification_id,
    //     date,
    //     title: notification?.title,
    //     productId: notification?.product_id,
    //     productName: notification?.product_name,
    //     productDiscountPer: notification?.d_per,
    //     productDiscountPrice: notification?.d_price,
    //     productPrice: notification?.price,
    //   };
    // } else
    if (notification.title == 'Order Expired') {
      notification = {
        id: notification?.notification_id,
        date,
        title: notification?.title,
        description: notification?.message,
        code: notification?.code,
        productId: notification?.productId?.[0]?.toString(0),
      };
    } else {
      notification = {
        id: notification?.notification_id,
        date,
        title: notification?.title,
        productId:
          notification?.products && notification?.products[0]?.product_id,
        productName:
          notification?.products && notification?.products[0]?.product_name,
        pharmacyId: notification?.pharmacy_id,
        pharmacyName: notification?.pharmacy_name,
        orderId: notification?.order_id,
        couponCode: notification?.code,
      };
    }
    return notification;
  };
  const onMessageCallback = async remoteMessage => {
    let notification = JSON.parse(remoteMessage?.data?.RequestData);
    notification = formatNotificationData(notification);
    // if (notification.title == 'Deal') {
    //   dispatch(addNewNotification(notification));
    //   ToastComponent.show({
    //     type: 'info',
    //     text1: notification?.title,
    //     text2: `${notification?.productDiscountPer}% OFF on ${notification?.productName}`,
    //     onPress: () => {
    //       ToastComponent.hide();
    //       dispatch(notificationSeen(notification?.id));
    //       Linking.openURL(
    //         `nutrabiotics://pro_detail/${notification?.productId}`,
    //       );
    //     },
    //   });
    // } else
    if (notification.title == 'Order Approval Request') {
      dispatch(addNewNotification(notification));
      setApprovalModalData(notification);
      setApprovalModal(true);
    } else if (notification.title == 'Order Expired') {
      dispatch(addNewNotification(notification));
      setExpiredModalData(notification);
      setExpiredModal(true);
    }
  };
  const backgroundMessageHandlerCallback = async remoteMessage => {
    let notification = JSON.parse(remoteMessage?.data?.RequestData);
    notification = formatNotificationData(notification);
    // if (notification.title == 'Deal') {
    //   dispatch(addNewNotification(notification));
    // } else
    if (notification.title == 'Order Approval Request') {
      dispatch(addNewNotification(notification));
    } else if (notification.title == 'Order Expired') {
      dispatch(addNewNotification(notification));
    }
  };
  const onNotificationOpenedAppCallback = async remoteMessage => {
    let notification = JSON.parse(remoteMessage?.data?.RequestData);
    notification = formatNotificationData(notification);
    // if (notification.title == 'Deal') {
    //   dispatch(notificationSeen(notification?.id));
    //   Linking.openURL(`nutrabiotics://pro_detail/${notification?.productId}`);
    // } else
    if (notification.title == 'Order Approval Request') {
      setApprovalModalData(notification);
      setApprovalModal(true);
    } else if (notification.title == 'Order Expired') {
      setExpiredModalData(notification);
      setExpiredModal(true);
    }
  };
  const getInitialNotificationCallback = async remoteMessage => {
    if (remoteMessage) {
      let notification = JSON.parse(remoteMessage?.data?.RequestData);
      notification = formatNotificationData(notification);
      // if (notification?.title == 'Deal') {
      //   setTimeout(() => {
      //     dispatch(notificationSeen(notification?.id));
      //   }, 5000);
      //   Linking.openURL(`nutrabiotics://pro_detail/${notification?.productId}`);
      // } else
      if (notification?.title == 'Order Approval Request') {
        setApprovalModalData(notification);
        setApprovalModal(true);
      } else if (notification.title == 'Order Expired') {
        setExpiredModalData(notification);
        setExpiredModal(true);
      }
    }
  };

  const listener = () => {
    unsubscribeOnMessage = messaging().onMessage(onMessageCallback);
    unsubscribeBackgroundMessageHandler =
      messaging().setBackgroundMessageHandler(backgroundMessageHandlerCallback);
    unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(
      onNotificationOpenedAppCallback,
    );
    messaging().getInitialNotification().then(getInitialNotificationCallback);
  };
  // useEffect(() => {
  //   if (userData) {
  //     configureDefaultHeaders(userData?.token);
  //     dispatch(getAllNotifications(userData?.id));
  //   }
  //   listener();
  //   return () => {
  //     unsubscribeOnMessage && unsubscribeOnMessage();
  //     unsubscribeBackgroundMessageHandler &&
  //       unsubscribeBackgroundMessageHandler();
  //     unsubscribeOnNotificationOpenedApp &&
  //       unsubscribeOnNotificationOpenedApp();
  //   };
  // }, [userData]);

  return (
    <>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="BottomTab"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="AuthStack" component={AuthRoutes} />
          <Stack.Screen name="AllProducts" component={AllProducts} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Coupens" component={Coupens} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="ProDetail" component={ProDetail} />
          <Stack.Screen
            name="PharmacyProDetail"
            component={PharmacyProDetail}
          />
          <Stack.Screen name="HowToOrder" component={HowToOrder} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="TermsConditions" component={TermsConditions} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
        </Stack.Navigator>
      </NavigationContainer>
      <ApprovalModal
        modal={approvalModal}
        setModal={setApprovalModal}
        data={approvalModalData}
      />

      <ExpiredModal
        modal={expiredModal}
        setModal={setExpiredModal}
        data={expiredModalData}
      />
    </>
  );
};

export default Routes;

const styles = StyleSheet.create({});
