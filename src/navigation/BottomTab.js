import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/BottomTabScreens/Home';
import Categories from '../screens/BottomTabScreens/Categories';
import Deals from '../screens/BottomTabScreens/Deals';
import Wishlist from '../screens/BottomTabScreens/Wishlist';
import Profile from '../screens/BottomTabScreens/Profile';
import { colors, fonts, fontSize, hp, wp } from '../constants/Constants';
import { useSelector } from 'react-redux';
import { productRequests } from '../constants/Api';
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  const [count, setCount] = useState(0);
  const userData = useSelector(state => state.UserReducer);
  const location = useSelector(state => state?.UserLocationReducer);
  const isfocused = useIsFocused();

  useEffect(() => {
    getData();
  }, [isfocused]);

  const getData = () => {
    const formData = new FormData();

    // ✅ Only send lat/long if both exist
    if (location?.latitude && location?.longitude) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }

    // ✅ Only send country if available
    if (location?.country) {
      formData.append('country', location.country);
    }

    productRequests
      .deals(formData)
      .then(res => {
        if (res.status === 200) {
          let allProducts = [];

          // 🟢 Case 1: if direct products are present, use them only
          if (res?.data?.products?.length > 0) {
            allProducts = res.data.products;
          }
          // 🟢 Case 2: else, use pharmaciesWithProducts
          else if (res?.data?.pharmaciesWithProducts?.length > 0) {
            allProducts = res.data.pharmaciesWithProducts.flatMap(
              pharmacy => pharmacy.products,
            );
          }

          setCount(allProducts.length);
        }
      })
      .catch(err =>
        console.log('bottom tab error', JSON.stringify(err?.response, null, 2)),
      );
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const iconPath =
          route.name == 'Home'
            ? require('../assets/icons/home.png')
            : route.name == 'Categories'
            ? require('../assets/icons/categories.png')
            : route.name == 'Deals'
            ? require('../assets/icons/deals.png')
            : route.name == 'Wishlist'
            ? require('../assets/icons/wishlist.png')
            : require('../assets/icons/profile.png');

        const iconPathFocused =
          route.name == 'Home'
            ? require('../assets/icons/home-focused.png')
            : route.name == 'Categories'
            ? require('../assets/icons/categories-focused.png')
            : route.name == 'Deals'
            ? require('../assets/icons/deals-focused.png')
            : route.name == 'Wishlist'
            ? require('../assets/icons/wishlist-focused.png')
            : require('../assets/icons/profile-focused.png');

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (
              (route.name == 'Deals' || route.name == 'Profile') &&
              !userData
            ) {
              navigation.navigate({ name: 'AuthStack' });
            } else {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.singleCont}
          >
            {label === 'Deals' && count > 0 ? (
              <View
                style={{
                  backgroundColor: colors.primary,
                  width: wp(5),
                  height: wp(5),
                  borderRadius: wp(3),
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: wp(3.7),
                  top: wp(1.8),
                }}
              >
                <Text
                  style={{
                    color: colors.bg,
                    fontSize: fontSize.xs,
                    fontFamily: fonts.regular,
                  }}
                >
                  {count > 9 ? '9+' : count}
                </Text>
              </View>
            ) : null}

            <Image
              resizeMode="contain"
              source={isFocused ? iconPathFocused : iconPath}
              style={styles.icon}
            />
            <Text
              style={[
                styles.txt,
                { color: isFocused ? colors.primary : colors.secondary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={'Home'} component={Home} />
      <Tab.Screen name={'Categories'} component={Categories} />
      <Tab.Screen name={'Deals'} component={Deals} />
      <Tab.Screen name={'Wishlist'} component={Wishlist} />
      <Tab.Screen name={'Profile'} component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    borderWidth: 0.5,
    borderColor: colors.grey,
    elevation: 5,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
  },
  singleCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: wp(3),
  },
  icon: {
    width: wp(6),
    height: wp(6),
  },
  txt: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
  },
});
