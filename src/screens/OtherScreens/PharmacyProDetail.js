import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  colors,
  fonts,
  fontSize,
  pharmaciesData,
  wp,
} from '../../constants/Constants';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {Icon} from '@rneui/themed';
import CustomButton from '../../components/CustomButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Slider from '../../components/Slider';
import {productRequests} from '../../constants/Api';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../redux/actions/WishlistActions';
import {useDispatch, useSelector} from 'react-redux';

const PharmacyProDetail = () => {
  const navigation = useNavigation();
  const params = useRoute().params;
  const product = params?.product;
  const pharmacy = params?.pharmacy;
  const nearestPharmacy = params?.nearestPharmacy;
  const [count, setCount] = useState(1);
  const [indicator, setIndicator] = useState(false);
  const [fav, setFav] = useState(product?.fav);
  const [orderResponse, setOrderResponse] = useState();
  const stock = parseInt(pharmacy?.pharmacyproduct[0]?.stock);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const userData = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.primary);
    }
    StatusBar.setBarStyle('light-content');
  });

  const add = () => {
    if (count < stock) {
      setCount(count + 1);
    } else {
      Toast.show(`Only ${count} ${count > 1 ? 'items' : 'item'} is available`);
    }
  };
  const minus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const order = () => {
    if (userData) {
      setIndicator(true);
      const formData = new FormData();
      formData.append('id', pharmacy?.id);
      formData.append('quantity', count);
      formData.append('near_pharmacy', JSON.stringify(nearestPharmacy));
      productRequests
        .order(product?.id, formData)
        .then(res => {
          if (res.status == 200) {
            setOrderResponse(res?.data?.successData?.order);
            setCount(1);
            setSuccessModal(true);
          } else {
            setErrorModal(true);
          }
        })
        .catch(err => {
          console.log(err);
          setErrorModal(true);
        })
        .finally(() => setIndicator(false));
    } else {
      navigation.navigate('AuthStack', {
        screen: 'Login',
        params: {goBack: true},
      });
    }
  };
  const favourite = () => {
    if (fav) {
      setFav(false);
      dispatch(removeFromWishlist(product));
    } else {
      setFav(true);
      dispatch(addToWishlist(product));
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS == 'ios' ? (
        <View
          style={{
            height: useSafeAreaInsets()?.top,
            width: wp(100),
            backgroundColor: colors.primary,
          }}
        />
      ) : null}

      {/* Order Success Modal */}
      <Modal style={styles.center} isVisible={successModal}>
        <View style={styles.modalContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/images/success.png')}
            style={styles.modalIcon}
          />
          <Text style={styles.successModalHeadingTxt}>
            Order Placed Successfully
          </Text>
          <Text style={styles.successModalTxt}>This is your coupon code</Text>
          <Text style={styles.successModalCouponTxt}>
            {orderResponse?.code || 'N/A'}
          </Text>
          <Text style={[styles.successModalTxt, {marginBottom: 20}]}>
            Show this code to relative pharmacy or nearby pharmacies within a
            50-km range and pick your product.This code will expire after 24
            hours.
          </Text>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => {
              setSuccessModal(false);
              navigation.replace('Coupens');
            }}>
            <Text style={styles.modalBtnTxt}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Order Failed Modal */}
      <Modal style={styles.center} isVisible={errorModal}>
        <View style={styles.modalContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/images/error.png')}
            style={styles.modalIcon}
          />
          <Text style={styles.errorModalTxt}>Failed To Place Order</Text>
          <Text style={styles.modalTxt}>
            Please try again or check your internet connection
          </Text>
          <TouchableOpacity
            style={styles.modalBtn}
            onPress={() => setErrorModal(false)}>
            <Text style={styles.modalBtnTxt}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={[
          {
            paddingBottom: wp(25),
            alignItems: 'center',
            backgroundColor: colors.bg,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imgCont}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtnCont}>
            <Icon type="material" name={'arrow-back'} color={colors.white} />
          </TouchableOpacity>
          {/* Favourite Container */}
          <TouchableOpacity onPress={favourite} style={[styles.favCont]}>
            <Icon
              type={'material'}
              name={'favorite'}
              color={fav ? colors.primary : colors.grey}
              size={wp(5)}
            />
          </TouchableOpacity>
          <Slider
            data={product?.photos}
            mainContainerStyle={{marginTop: wp(12)}}
            imageStyle={{width: wp(50), height: wp(50), borderRadius: 0}}
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
        <View style={{width: wp(90)}}>
          <Text style={styles.title} numberOfLines={5}>
            {product?.product_name}
          </Text>
          <Text
            style={[
              styles.txt,
              {
                marginTop: wp(5),
                color: colors.primary,
                fontFamily: fonts.regular,
                fontSize: fontSize.m,
              },
            ]}>
            Price:{' '}
            <Text style={{fontFamily: fonts.bold}}>
              {product?.product_details[0]?.currency}{' '}
              {product?.product_details[0]?.d_price > 0
                ? product?.product_details[0]?.d_price
                : product?.product_details[0]?.price}
            </Text>
          </Text>
          <Text style={[styles.txt, {marginTop: wp(5)}]}>
            Available items:{' '}
            <Text style={{fontFamily: fonts.bold, color: colors.primary}}>
              {stock || 0}
            </Text>
          </Text>
          <Text
            style={[
              styles.txt,
              {
                marginTop: wp(5),
                color: colors.blue,
                fontFamily: fonts.bold,
                fontSize: fontSize.m,
              },
            ]}>
            {pharmacy?.name}
          </Text>
          <Text style={[styles.txt, {marginTop: wp(5)}]}>Location</Text>
          <Text
            style={[styles.txt, {marginTop: wp(1), fontFamily: fonts.regular}]}>
            {pharmacy?.address}
          </Text>
          <Text style={[styles.txt, {marginTop: wp(5)}]}>Email</Text>
          <Text
            style={[styles.txt, {marginTop: wp(1), fontFamily: fonts.regular}]}>
            {pharmacy?.email}
          </Text>
          <Text style={[styles.txt, {marginTop: wp(5)}]}>Contact</Text>
          <Text
            style={[styles.txt, {marginTop: wp(1), fontFamily: fonts.regular}]}>
            {pharmacy?.phone}
          </Text>
          <View
            style={{
              marginTop: wp(10),
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={add} style={[styles.addMinusCont]}>
                <Icon
                  type={'material'}
                  name={'add'}
                  color={colors.secondary}
                  size={wp(5)}
                />
              </TouchableOpacity>
              <Text style={[styles.counterTxt]}>{count}</Text>
              <TouchableOpacity onPress={minus} style={[styles.addMinusCont]}>
                <Icon
                  type={'material'}
                  name={'remove'}
                  color={colors.secondary}
                  size={wp(5)}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                textAlign: 'right',
                color: colors.primary,
                fontFamily: fonts.regular,
              }}>
              Total:{' '}
              <Text style={{fontFamily: fonts.bold}}>
                {product?.product_details[0]?.currency}{' '}
                {product?.product_details[0]?.d_price > 0
                  ? product?.product_details[0]?.d_price * count
                  : product?.product_details[0]?.price * count}
              </Text>
            </Text>
          </View>
        </View>
        <CustomButton
          buttonText={'Purchase'}
          containerStyle={{marginTop: wp(8)}}
          indicator={indicator}
          onPress={order}
        />
      </ScrollView>
    </View>
  );
};

export default PharmacyProDetail;

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
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.s,
    color: colors.secondary,
  },
  locationMainCont: {
    width: wp(90),
    padding: 5,
    paddingTop: 0,
  },
  locationCont: {
    elevation: 3,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 5,
  },
  desc: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.secondary,
    padding: 10,
    backgroundColor: colors.white,
    elevation: 3,
    borderRadius: 10,
    textAlign: 'justify',
  },
  addMinusCont: {
    padding: 8,
    elevation: 3,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  counterTxt: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.s,
    color: colors.secondary,
    width: 60,
    textAlign: 'center',
  },
  modalContainer: {
    width: wp(90),
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
  successModalHeadingTxt: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
    color: colors.success,
    marginVertical: 20,
  },
  successModalTxt: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: fontSize.m,
    color: colors.secondary,
  },
  successModalCouponTxt: {
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    color: colors.primary,
    marginVertical: 10,
  },
  errorModalTxt: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
    color: colors.error,
  },
  modalTxt: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.darkGrey,
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
});
