import {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  colors,
  fonts,
  fontSize,
  indicatorSize,
  pharmaciesData,
  wp,
} from '../../constants/Constants';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Google_Map_API_Key, productRequests } from '../../constants/Api';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '../../components/Slider';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../redux/actions/WishlistActions';
import { userLocation } from '../../redux/actions/UserLocation';
import Geolocation, {
  getCurrentPosition,
} from 'react-native-geolocation-service';

let discountPercent = 0;

const ProDetail = () => {
  const navigation = useNavigation();
  const params = useRoute()?.params;
  const reduxLocation = useSelector(state => state?.UserLocationReducer);

  const location = reduxLocation;
  const id = params?.id;
  const [product, setProduct] = useState(null);
  const [fav, setFav] = useState(false);
  const [storeItem, setStoreItem] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [indicator, setIndicator] = useState(true);
  const [modal, setModal] = useState(false);
  const [pharmacyIDs, setPharmacyIDs] = useState(null);
  const userData = useSelector(state => state.UserReducer);
  const wishlistData = useSelector(state => state.WishlistReducer);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.primary);
    }
    StatusBar.setBarStyle('light-content');
  });

  const getProductDetail = async () => {
    setModal(false);
    setIndicator(true);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('user_id', userData?.id);
    if (location?.latitude && location?.longitude) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }

    if (location?.country) {
      formData.append('country', location.country);
    }
    console.log('@FORM DATA', formData);
    productRequests
      .productDetail(formData)
      .then(res => {
        if (res.status == 200) {
          console.log('@RESSS in product detail', res?.data);
          const product = res?.data?.product;
          // const images = product?.photos?.map((item, index) => {
          //   setStoreItem(item);
          //   return { id: index, image: item?.photo };
          // });
          const images = product?.photos?.map((item, index) => {
            return { id: index, photo: item?.photo }; // photo key correct
          });
          const percent = product?.product_details[0]?.d_per
            ? Number(product?.product_details[0]?.d_per)
            : 0;

          const near_pharmacy_ids = res?.data?.nearestPharmacy?.map(
            pharmacy => pharmacy?.id,
          );
          setPharmacyIDs(near_pharmacy_ids);
          const updatedProduct = {
            ...product,
            photos: images, // only photos updated
            d_per: percent,
          };

          setProduct(updatedProduct);
          // setProduct({ ...product, d_per: percent, photos: images });
          setPharmacies(res?.data?.nearestPharmacy);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setIndicator(false));
  };
  console.log('@@@@', product);
  const favourite = () => {
    if (!product) return;

    if (fav) {
      setFav(false);
      dispatch(removeFromWishlist(product));
    } else {
      setFav(true);
      dispatch(addToWishlist(product));
    }
  };

  useEffect(() => {
    getProductDetail();
  }, [params]);

  useEffect(() => {
    if (isFocused) {
      if (wishlistData?.find(it => it.id == id)) {
        setFav(true);
      } else {
        setFav(false);
      }
    }
  }, [isFocused, wishlistData]);

  return (
    <View style={styles.container}>
      {/* Location Modal */}
      <Modal style={styles.center} isVisible={modal}>
        <View style={styles.modalContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/icons/location.png')}
            style={styles.modalIcon}
          />
          <Text style={styles.modalTxt}>
            Nutrabiotics needs your location permission to show nearest
            pharmacies in which this product is available
          </Text>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => getProductDetail()}
          >
            <Text style={styles.modalBtnTxt}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {indicator ? (
        <View style={{ flex: 1, ...styles.center }}>
          <ActivityIndicator color={colors.primary} size={indicatorSize.m} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            { paddingBottom: wp(25), alignItems: 'center' },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imgCont}>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtnCont}
            >
              <Icon type="material" name={'arrow-back'} color={colors.white} />
            </TouchableOpacity>
            {/* Favourite Container */}
            <TouchableOpacity
              onPress={() => favourite()}
              style={[styles.favCont]}
            >
              <Icon
                type={'material'}
                name={'favorite'}
                color={fav ? colors.primary : colors.grey}
                size={wp(5)}
              />
            </TouchableOpacity>
            <Slider
              data={product?.photos}
              mainContainerStyle={{ marginTop: wp(12) }}
              imageStyle={{
                width: wp(50),
                height: wp(50),
                borderRadius: 0,
              }}
              disableAutoScroll={true}
              activeDotStyle={{
                borderColor: colors.white,
                backgroundColor: colors.white,
              }}
              dotStyle={{
                borderColor: colors.white,
                backgroundColor: colors.primary,
              }}
              imageResizeMode={'contain'}
            />
          </View>
          <View style={{ width: wp(90) }}>
            <Text style={styles.title}>{product?.product_name}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: wp(5),
                flex: 1,
                overflow: 'hidden',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.txt, { fontFamily: fonts.regular }]}
                >
                  Price:{' '}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.txt,
                    { fontFamily: fonts.bold },
                    product?.product_details[0]?.d_per > 0
                      ? {
                          textDecorationLine: 'line-through',
                          color: colors.darkGrey,
                          fontFamily: fonts.medium,
                          fontSize: fontSize.s,
                        }
                      : null,
                  ]}
                >
                  {product?.product_details[0]?.currency}{' '}
                  {Number(product?.product_details[0]?.price)
                    .toFixed(2)
                    .replace(/.00$/, '')}
                </Text>
                {product?.product_details[0]?.d_per > 0 ? (
                  <Text
                    numberOfLines={1}
                    style={[styles.txt, { fontFamily: fonts.bold }]}
                  >
                    {' '}
                    {Number(product?.product_details[0]?.d_price)
                      .toFixed(2)
                      .replace(/.00$/, '')}{' '}
                  </Text>
                ) : null}
              </View>
              <View>
                {product?.product_details[0]?.d_per > 0 ? (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.txt,
                      {
                        fontFamily: fonts.bold,
                        alignSelf: 'flex-end',
                        color: colors.blue,
                      },
                    ]}
                  >
                    {' '}
                    {Number(product?.product_details[0]?.d_per)
                      .toFixed(2)
                      .replace(/.00$/, '')}
                    % OFF
                  </Text>
                ) : null}
              </View>
            </View>
            <View>
              <Text style={[styles.txt, { marginBottom: wp(2) }]}>
                Available Locations
              </Text>
              <View style={styles.locationMainCont}>
                {pharmacies?.length > 0 ? (
                  pharmacies.map((item, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('PharmacyProDetail', {
                            product,
                            pharmacy: item,
                            nearestPharmacy: pharmacyIDs,
                          })
                        }
                        style={[
                          styles.locationCont,
                          {
                            marginTop: index == 0 ? 0 : wp(2),
                          },
                        ]}
                        key={index}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.txt,
                              {
                                color: colors.primary,
                                marginLeft: 20,
                              },
                            ]}
                          >
                            {item?.name}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Icon
                              type={'material'}
                              name={'place'}
                              color={colors.darkGrey}
                              size={20}
                            />
                            <Text
                              numberOfLines={3}
                              style={[
                                styles.txt,
                                {
                                  color: colors.darkGrey,
                                  fontFamily: fonts.regular,
                                  fontSize: fontSize.s,
                                  width: wp(73),
                                },
                              ]}
                            >
                              {item?.address || 'N/A'}
                            </Text>
                          </View>
                        </View>
                        <Icon
                          type={'material'}
                          name={'chevron-right'}
                          color={colors.darkGrey}
                          size={20}
                        />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.noDataTxt}>
                    This product is not available in any pharmacy yet!
                  </Text>
                )}
              </View>
              <View style={{ marginTop: wp(3) }}>
                <Text style={[styles.txt, { marginBottom: wp(2) }]}>
                  Benefits
                </Text>
                <View style={styles.descCont}>
                  <Text style={styles.desc}>{product?.description}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ProDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  imgCont: {
    width: wp(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  image: {
    width: wp(60),
    height: wp(60),
    marginTop: wp(10),
    marginBottom: wp(3),
  },
  backBtnCont: {
    position: 'absolute',
    top: 10,
    left: wp(5),
  },
  favCont: {
    position: 'absolute',
    top: 10,
    right: wp(5),
    height: wp(8),
    width: wp(8),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.mToL,
    color: colors.black,
    marginTop: wp(3),
  },
  txt: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    color: colors.primary,
  },
  locationMainCont: {
    width: wp(90),
    padding: 5,
    paddingTop: 0,
  },
  locationCont: {
    elevation: 2,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 5,
  },
  descCont: {
    padding: 10,
    backgroundColor: colors.white,
    elevation: 2,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  desc: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.secondary,
    textAlign: 'justify',
  },
  modalContainer: {
    width: wp(80),
    height: wp(80),
    backgroundColor: colors.white,
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(5),
    paddingTop: wp(8),
  },
  modalIcon: {
    width: wp(20),
    height: wp(20),
  },
  modalTxt: {
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: fontSize.m,
    color: colors.black,
  },
  modalBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: wp(10),
    borderRadius: 10,
  },
  modalBtnTxt: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
  },
  noDataTxt: {
    color: colors.darkGrey,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    width: wp(80),
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: wp(10),
  },
});
