import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  colors,
  fonts,
  fontSize,
  homeSubCatData,
  hp,
  indicatorSize,
  proData,
  wp,
} from '../../constants/Constants';
import { Icon } from '@rneui/themed';
import InputField from '../../components/InputField';
import CategoriesComponent from '../../components/CategoriesComponent';
import { TouchableOpacity } from 'react-native';
import ProFlatlistHorizontal from '../../components/ProFlatlistHorizontal';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Google_Map_API_Key, productRequests } from '../../constants/Api';
import Slider from '../../components/Slider';
import { CheckBox } from '@rneui/themed';
import { authRequests } from '../../constants/Api';

import { userLocation } from '../../redux/actions/UserLocation';
import Geolocation, {
  getCurrentPosition,
} from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

const Home = () => {
  Geocoder.init('AIzaSyA5VajG6zbWb_yIBiO-WkUDbPvDMVL-1TQ');

  const navigation = useNavigation();
  const userData = useSelector(state => state.UserReducer);
  const wishlistData = useSelector(state => state.WishlistReducer);
  const [banners, setBanners] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [indicator, setIndicator] = useState(true);
  const [location, setLocation] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState('');
  const [isChecked, setIsChecked] = useState(true);
  const [allCountries, setAllCountries] = useState([]);
  const [address, setAddress] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const reduxLocation = useSelector(state => state?.UserLocationReducer);
  const loadingRef = useRef(false);

  const scrollRef = useRef();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const USER_COUNTRY = useSelector(
    state => state?.UserLocationReducer?.country,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!isFocused || loadingRef.current) return;
      loadingRef.current = true;
      setIndicator(true);

      try {
        const userCurrentLocation = await getLocation();
        const res = await productRequests.home();

        setBanners(res?.data?.successData?.banner || []);
        setSubCategories(res?.data?.successData?.data || []);
        fetchPopularData(
          userCurrentLocation?.latitude,
          userCurrentLocation?.longitude,
          country,
        );
      } catch (err) {
        console.log('Error:', err);
      } finally {
        setIndicator(false);
        setTimeout(() => (loadingRef.current = false), 1500);
      }
    };

    fetchData();
  }, [isFocused, country]);

  useEffect(() => {
    fetchCountries();
  }, []);

  // ✅ Filter countries on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(allCountries);
    } else {
      setFilteredCountries(
        allCountries.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery, allCountries]);

  useEffect(() => {
    if (isFocused && products.length > 0) {
      const data = products.map(item => {
        if (wishlistData?.find(it => it.id == item.id)) {
          item.fav = true;
        } else {
          item.fav = false;
        }
        return { ...item };
      });
      setProducts(data);
    }
  }, [isFocused]);
  // ✅ Get Location
  const getLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return;
        }
      }

      Geolocation.getCurrentPosition(
        async position => {
          const coords = position.coords;
          const { latitude, longitude } = position.coords;
          const geoData = await Geocoder.from(latitude, longitude);
          const address = geoData.results[0].formatted_address;
          setAddress(address);
          setLocation(coords);

          try {
            const countryName = await getAddressFromCoordinates(
              coords.latitude,
              coords.longitude,
            );
            if (!country) {
              // agar dropdown se already select nahi hua
              setCountry(countryName);
              dispatch(
                userLocation({
                  country: countryName,
                  latitude: coords?.latitude,
                  longitude: coords?.longitude,
                }),
              );
            }

            fetchPopularData(coords.latitude, coords.longitude, countryName);
          } catch (e) {
            console.log('Country fetch error:', e);
          }
        },
        error => console.log('Location Error:', error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
      );
    } catch (err) {
      console.log('getLocation crash:', err);
    }
  };

  // ✅ Fetch all countries for modal
  const fetchCountries = async () => {
    try {
      const res = await authRequests.getCountries();
      setAllCountries(res?.data?.successData || []);
      setFilteredCountries(res?.data?.successData || []);
    } catch (error) {
      console.log('Error fetching countries:', error);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${Google_Map_API_Key}`,
    );
    const responseJson = await response.json();
    if (responseJson?.status === 'OK') {
      return (
        responseJson?.results?.[0]?.address_components?.find(component =>
          component.types.includes('country'),
        )?.long_name || null
      );
    }
    return null;
  };

  const fetchPopularData = async (latitude, longitude, country) => {
    try {
      setIndicator(true);
      const formData = new FormData();

      if (reduxLocation?.latitude && reduxLocation?.longitude) {
        formData.append('latitude', reduxLocation?.latitude);
        formData.append('longitude', reduxLocation?.longitude);
      }

      if (reduxLocation?.country) {
        formData.append('country', reduxLocation?.country);
      }
      console.log('@FOMRDATA', formData);
      const res = await productRequests.populars(formData);
      // if (res?.status === 200) {
      //   console.log('@respo', res?.data);
      //   const products = res?.data?.availableProducts?.map(item => {
      //     item = item?.product?.product;
      //     item.fav = wishlistData?.some(it => it.id === item.id);
      //     return { ...item };
      //   });
      //   setProducts(products || []);
      // }
      if (res?.status === 200) {
        console.log('@respo', res?.data);

        let products = [];

        // 🟢 Case 1: availableProducts
        if (res?.data?.availableProducts?.length > 0) {
          products = res.data.availableProducts
            .map(item => {
              const productItem = item?.product?.product;
              if (!productItem) return null;
              productItem.fav = wishlistData?.some(
                it => it.id === productItem.id,
              );
              return { ...productItem };
            })
            .filter(Boolean); // ✅ remove null items
        }

        // 🟢 Case 2: products
        else if (res?.data?.products?.length > 0) {
          products = res.data.products
            .map(item => {
              const productItem = item?.product;
              if (!productItem) return null; // ✅ skip if null
              productItem.fav = wishlistData?.some(
                it => it.id === productItem.id,
              );
              return { ...productItem };
            })
            .filter(Boolean); // ✅ remove nulls
        }

        console.log('@product', products);
        setProducts(products || []);
      }
    } catch (error) {
      console.log('Error in fetchPopularData:', error);
    } finally {
      setIndicator(false);
    }
  };
  const handleLocationCheckbox = async newValue => {
    setIsChecked(newValue);

    if (newValue) {
      try {
        // ✅ Android permission check
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Location permission is required');
            return;
          }
        }

        // ✅ Get current position
        Geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            try {
              // ✅ Get country using Geocoder
              const geoData = await Geocoder.from(latitude, longitude);
              const addressComponents =
                geoData.results[0]?.address_components || [];
              const countryName =
                addressComponents.find(c => c.types.includes('country'))
                  ?.long_name || null;

              // if (countryName) {
              //   setCountry(countryName);
              //   dispatch(userLocation({ country: countryName }));
              // }
              if (countryName) {
                setCountry(countryName);
                dispatch(
                  userLocation({
                    country: countryName,
                    latitude,
                    longitude,
                  }),
                );
              }
              console.log(
                '✅ Location fetched successfully:',
                latitude,
                longitude,
                countryName,
              );

              // ✅ Optional: Refresh popular products based on new location
              fetchPopularData(latitude, longitude, countryName);
            } catch (geoErr) {
              console.log('Geocoding Error:', geoErr);
            }
          },
          error => {
            console.log('Location Error:', error);
            Alert.alert('Error', 'Unable to fetch current location');
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
        );
      } catch (err) {
        console.log('Error in handleLocationCheckbox:', err);
      }
    } else {
      // ❌ Checkbox OFF → clear both location & country
      setLocation({});
      // setCountry(null);
      // dispatch(userLocation({ country: null }));
      setCountry('Pakistan');
      dispatch(userLocation({ country: 'Pakistan' }));
      console.log('❌ Location & country cleared');
    }
  };

  const renderHeader = () => (
    <View
      style={[
        styles.header,
        {
          flexDirection: 'row',
          alignItems: 'flex-start', // ✅ top align everything
          justifyContent: 'space-between',
          paddingVertical: wp(2),
        },
      ]}
    >
      {/* ✅ Checkbox + Address (Grouped) */}
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {/* Checkbox */}
        <CheckBox
          checked={isChecked}
          onPress={() => handleLocationCheckbox(!isChecked)}
          containerStyle={{
            padding: 0,
            margin: 0,
            marginTop: wp(0.8),
          }}
          checkedIcon={
            <Icon
              name="checkbox-marked"
              type="material-community"
              size={wp(5)}
              color={colors.primary}
            />
          }
          uncheckedIcon={
            <Icon
              name="checkbox-blank-outline"
              type="material-community"
              size={wp(5)}
              color={colors.secondary}
            />
          }
        />

        {/* Address + Country */}
        <TouchableOpacity
          onPress={() => setCountryModalVisible(true)}
          style={{ flex: 1, marginLeft: wp(-2), marginRight: wp(2) }}
        >
          {/* Address */}
          <Text
            style={{
              fontSize: wp(3.6),
              marginTop: wp(0.5),
              fontFamily: fonts.semiBold,
              color: colors.black,
            }}
            numberOfLines={1}
          >
            {address ? address : 'Detecting location...'}
          </Text>

          {/* Country + Dropdown */}
          {country ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: wp(0.8),
              }}
            >
              <Image
                source={require('../../assets/icons/location.png')}
                style={{
                  width: wp(3.5),
                  height: wp(3.5),
                  tintColor: colors.primary,
                  marginRight: wp(1),
                }}
                resizeMode="contain"
              />

              <Text
                style={{
                  fontSize: wp(3),
                  color: colors.primary,
                  fontFamily: fonts.medium,
                }}
                numberOfLines={1}
              >
                {country}
              </Text>

              <Pressable
                onPress={() => setCountryModalVisible(true)}
                hitSlop={10}
                style={{ marginLeft: wp(0.5), marginTop: wp(1) }}
              >
                <Icon
                  name="chevron-down"
                  type="ionicon"
                  size={wp(4)}
                  color={colors.secondary}
                />
              </Pressable>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* ✅ Notification Icon */}
      <Pressable
        onPress={() =>
          userData
            ? navigation.navigate('Notifications')
            : navigation.navigate('AuthStack')
        }
        style={{
          height: wp(9),
          width: wp(9),
          borderRadius: wp(4.5),
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
        }}
      >
        <Icon
          type={'ionicon'}
          name={'notifications-outline'}
          color={colors.primary}
          size={wp(5)}
        />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, styles.center]}>
      <ScrollView
        stickyHeaderIndices={[1]}
        contentContainerStyle={{
          paddingBottom: wp(25),
          flexGrow: 1,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        <InputField
          placeholder={'Search'}
          leftIconName={'search'}
          leftIconType={'material'}
          leftIconColor={colors.grey}
          inputContainerStyle={{ borderRadius: 20, width: wp(90) }}
          mainContainerStyle={{
            width: wp(100),
            backgroundColor: colors.bg,
            ...styles.center,
          }}
          dummy
          onPress={() => navigation.navigate('Search')}
        />
        {indicator ? (
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator
              style={{ alignSelf: 'center' }}
              size={indicatorSize.m}
              color={colors.primary}
            />
          </View>
        ) : (
          <>
            <Slider
              scrollRef={scrollRef}
              data={banners}
              imageResizeMode={'contain'}
            />
            <View
              style={{
                flexDirection: 'row',
                width: wp(90),
                marginVertical: 10,
              }}
            >
              <Text style={styles.heading}>Top Categories</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Categories', {
                    location: location,
                    country: country,
                  })
                }
              >
                <Text style={styles.viewAll}>View all</Text>
              </TouchableOpacity>
            </View>
            <CategoriesComponent
              data={subCategories?.slice(0, 8)}
              {...(location?.latitude ? { location } : {})}
              country={country}
            />
            <ProFlatlistHorizontal
              data={products?.slice(0, 10)}
              heading={'Popular'}
              onViewAllPress={() =>
                navigation.navigate('AllProducts', {
                  heading: 'Popular',
                  data: products,
                  location: {
                    latitude: reduxLocation?.latitude,
                    longitude: reduxLocation?.longitude,
                  },
                  country: country,
                })
              }
            />
          </>
        )}
        {/* ✅ Country Modal */}
        <Modal
          visible={countryModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCountryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Pressable
                style={{ alignSelf: 'flex-end', marginBottom: wp(4) }}
                onPress={() => setCountryModalVisible(false)}
              >
                <Icon
                  name="close"
                  type="ionicon"
                  size={22}
                  color={colors.secondary}
                />
              </Pressable>

              <View style={styles.searchContainer}>
                <Icon
                  name="search"
                  type="ionicon"
                  size={18}
                  color={colors.grey}
                />
                <TextInput
                  placeholder="Search country..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>

              <FlatList
                data={filteredCountries}
                keyExtractor={item => item?.id?.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setLocation({});
                      setCountry(item.name);
                      setIsChecked(false);
                      dispatch(
                        userLocation({
                          country: item.name,
                          // latitude: null,
                          // longitude: null,
                        }),
                      );
                      setCountryModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      {country === item.name && (
                        <Icon
                          name="checkmark"
                          type="ionicon"
                          size={18}
                          color={colors.primary}
                        />
                      )}
                    </View>
                  </Pressable>
                )}
              />

              <Pressable
                onPress={() => setCountryModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: wp(90),
    alignItems: 'center',
    marginTop: wp(2),
    paddingVertical: 10,
  },
  notificationCont: {
    height: wp(10),
    aspectRatio: 1,
    borderRadius: wp(5),
    backgroundColor: colors.white,
    elevation: 5,
    shadowOffset: { width: 2, height: 3 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -5 }],
  },
  locationTxt: {
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.secondary,
  },
  nameTxt: {
    fontFamily: fonts.bold,
    fontSize: fontSize.l,
    color: colors.secondary,
  },
  heading: {
    color: colors.secondary,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    flex: 1,
  },
  viewAll: {
    color: colors.primary,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(80),
    maxHeight: hp(50),
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fontSize.m,
    fontFamily: fonts.semiBold,
    color: colors.secondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: fontSize.s,
    color: colors.secondary,
  },
  modalCancelBtn: {
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  modalCancelText: {
    color: '#fff',
    fontFamily: fonts.semiBold,
    fontSize: fontSize.s,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: wp(3),
    paddingHorizontal: 6,
    fontSize: fontSize.m,
    color: colors.secondary,
  },
});
