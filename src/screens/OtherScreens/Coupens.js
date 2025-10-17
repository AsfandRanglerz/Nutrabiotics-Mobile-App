import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  colors,
  CoupensData,
  fonts,
  fontSize,
  wp,
} from '../../constants/Constants';
import Header from '../../components/Header';
import { Icon } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { productRequests } from '../../constants/Api';
import { indicatorSize } from '../../constants/Constants';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';

const coupenColors = ['#041a87', '#9c020c', '#286303'];

const Coupens = () => {
  const [data, setData] = useState([]);
  const [indicator, setIndicator] = useState(false);
  const [indicatorPharmacy, setIndicatorPharmacy] = useState(false);
  const [modal, setModal] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [indexNum, setIndexNum] = useState(0);
  const userData = useSelector(state => state.UserReducer);
  const USER_LOCATION = useSelector(state => state?.UserLocationReducer);
  const USER_COUNTRY = useSelector(
    state => state?.UserLocationReducer?.country,
  );
  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });
  const getCoupens = () => {
    setIndicator(true);
    productRequests
      .coupen(USER_COUNTRY)
      .then(res => {
        if (res.status == 200) {
          const data = res?.data?.successData?.map(item => {
            const productDetails = item?.product?.product_details?.[0] || {};
            return {
              id: item?.id,
              date: new Date(item?.created_at).toLocaleDateString(),
              productName: item?.product?.product_name || 'N/A',
              price:
                productDetails?.d_price > 0
                  ? productDetails?.d_price
                  : productDetails?.price || item?.price,
              currency: productDetails?.currency || item?.currency || 'PKR',
              coupenCode: item?.order?.code || item?.code || 'N/A',
              pharmacyName:
                item?.order?.pharmacy?.name || item?.pharmacy_name || 'N/A',
              pharmacyAddress:
                item?.order?.pharmacy?.address ||
                item?.pharmacy_address ||
                'N/A',
              quantity: item?.quantity,
              product_id: item?.product_id,
              expired: item?.order?.status || item?.status,
            };
          });

          setData(data);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIndicator(false));
  };
  useEffect(() => {
    getCoupens();
  }, []);

  const AvailablePharmacy = async coupon => {
    setIndicatorPharmacy(true);
    productRequests
      .availablePharmacy(coupon)
      .then(res => {
        if (res.status == 200) {
          const data = res?.data?.successData;
          if (data?.length > 0) {
            setModal(!modal);
            setPharmacies(data);
          } else {
            Toast.show(
              'Sorry, no pharmacies are currently available.',
              Toast.SHORT,
            );
          }
        }
      })
      .catch(err => console.log('Available pharmacy error', err))
      .finally(() => setIndicatorPharmacy(false));
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header heading={'My Coupons'} />
      {indicator ? (
        <View style={[{ flex: 1 }, styles.center]}>
          <ActivityIndicator color={colors.primary} size={indicatorSize.m} />
        </View>
      ) : data?.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            width: wp(90),
            padding: 5,
            paddingBottom: 30,
          }}
          ListHeaderComponentStyle={{ height: 10 }}
          ListHeaderComponent={<View />}
          renderItem={({ item, index }) => {
            return (
              <Pressable onPress={() => {}} style={styles.coupenCont}>
                <View
                  style={[
                    styles.firstCont,
                    {
                      backgroundColor:
                        (index + 1) % 3 == 0
                          ? coupenColors[2]
                          : (index + 1) % 2 == 0
                          ? coupenColors[1]
                          : coupenColors[0],
                    },
                  ]}
                >
                  <Text numberOfLines={2} style={styles.title}>
                    {item?.productName}
                  </Text>
                  <Text numberOfLines={1} style={styles.price}>
                    {item?.expired == '4'
                      ? 'Expired'
                      : item?.expired == '1'
                      ? 'Used'
                      : `${item?.currency} ${item?.price}`}

                    {/* {item?.currency} */}
                    {/* {item?.price * item?.quantity} */}
                    {/* {item?.price} */}
                  </Text>
                </View>
                <View style={styles.txtContainer}>
                  <Text numberOfLines={1} style={styles.txtHeading}>
                    Pharmacy Name:{' '}
                    <Text numberOfLines={1} style={styles.txt}>
                      {item?.pharmacyName}
                    </Text>
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={[styles.txtHeading, { marginTop: wp(1) }]}
                  >
                    Pharmacy Address:{' '}
                    <Text style={styles.txt}>{item?.pharmacyAddress}</Text>
                  </Text>
                  {/* <View style={styles.locationContainer}>
                    <Icon
                      type={'material'}
                      name={'place'}
                      color={colors.primary}
                      size={20}
                      style={{marginLeft: -4}}
                    />
                    <Text numberOfLines={3} style={styles.txt}>
                      {item?.pharmacyName}
                      Ranglerz Digital Marketing, 95FP+CW6, Sector C Commercial
                      Area Sector C Bahria Town, Lahore, Punjab 53720
                    </Text>
                  </View> */}
                  <TouchableOpacity
                    style={styles.locationContainer}
                    onPress={() => {
                      AvailablePharmacy(item?.coupenCode);
                      setIndexNum(index);
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.txtHeading,
                        {
                          color:
                            (index + 1) % 3 == 0
                              ? coupenColors[2]
                              : (index + 1) % 2 == 0
                              ? coupenColors[1]
                              : coupenColors[0],
                          fontFamily: fonts.bold,
                        },
                      ]}
                    >
                      {'Available Pharmacies'}
                    </Text>
                    {indicatorPharmacy && index == indexNum ? (
                      <ActivityIndicator
                        size={20}
                        color={
                          (index + 1) % 3 == 0
                            ? coupenColors[2]
                            : (index + 1) % 2 == 0
                            ? coupenColors[1]
                            : coupenColors[0]
                        }
                      />
                    ) : (
                      <Icon
                        type={'entypo'}
                        name={'circle-with-plus'}
                        color={
                          (index + 1) % 3 == 0
                            ? coupenColors[2]
                            : (index + 1) % 2 == 0
                            ? coupenColors[1]
                            : coupenColors[0]
                        }
                        size={23}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.txtContainer,
                    { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
                  ]}
                >
                  <Text
                    numberOfLines={3}
                    style={[styles.txtHeading, { marginTop: wp(1) }]}
                  >
                    QTY: <Text style={styles.txt}>{item?.quantity}</Text>
                  </Text>
                  <Text numberOfLines={1} style={styles.txtHeading}>
                    Coupon Code:
                  </Text>
                  <View style={styles.lastCont}>
                    <Text numberOfLines={1} style={styles.txt}>
                      {item?.coupenCode}
                    </Text>
                    <Text numberOfLines={1} style={styles.date}>
                      {item?.date}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <View style={[{ flex: 1 }, styles.center]}>
          <Text style={styles.noDataTxt}>No Coupon Found</Text>
        </View>
      )}

      {/* Available Pharmacies Modal   */}
      <Modal isVisible={modal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.crossIcon}
            onPress={() => setModal(!modal)}
          >
            <Icon
              name="circle-with-cross"
              type="entypo"
              color={colors.error}
              size={25}
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}> {'Available Pharmacies'}</Text>
          <FlatList
            data={pharmacies}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => {
              return (
                <Pressable onPress={() => setModal(!modal)}>
                  <Text numberOfLines={1} style={styles.modaltxtHeading}>
                    Pharmacy Name:{' '}
                    <Text numberOfLines={1} style={styles.txt}>
                      {item?.pharmacy?.name}
                    </Text>
                  </Text>
                  <Text numberOfLines={3} style={[styles.modaltxtHeading]}>
                    Pharmacy Address:{' '}
                    <Text style={styles.txt}>{item?.pharmacy?.address}</Text>
                  </Text>
                  <View style={styles.underline}></View>
                </Pressable>
              );
            }}
          />
          <Text style={[styles.modalTitle, { marginHorizontal: wp(2) }]}>
            You can take your order from these pharmacies as well
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Coupens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coupenCont: {
    width: wp(90) - 10,
    marginTop: wp(3),
    borderRadius: 10,
    elevation: 3,
  },
  firstCont: {
    padding: wp(2),
    paddingVertical: wp(3),
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  lastCont: {
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
    color: colors.white,
    flex: 1,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
    color: colors.white,
    textAlign: 'right',
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.grey,
    flex: 1,
    textAlign: 'right',
  },
  noDataTxt: {
    fontFamily: fonts.regular,
    fontSize: fontSize.m,
    color: colors.darkGrey,
  },
  txtContainer: {
    backgroundColor: colors.white,
    padding: wp(2),
  },
  txtHeading: {
    flex: 1,
    color: colors.primary,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.s,
  },
  txt: {
    flex: 1,
    color: colors.darkGrey,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  modalContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    elevation: 3,
    width: wp(90),
    alignItems: 'center',
    paddingVertical: 10,
  },
  modaltxtHeading: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.s,
  },
  underline: {
    width: wp(82),
    height: wp(0.3),
    backgroundColor: colors.darkGrey,
    marginTop: 10,
    marginBottom: 5,
  },
  modalTitle: {
    color: colors.black,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    marginBottom: 5,
  },
  crossIcon: {
    position: 'absolute',
    right: wp(2),
    top: wp(2),
  },
});
