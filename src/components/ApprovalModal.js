import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import CustomButton from './CustomButton';
import Modal from 'react-native-modal';
import {colors, fontSize, fonts, wp} from '../constants/Constants';
import {Icon} from '@rneui/themed';
import {productRequests} from '../constants/Api';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {notificationSeen} from '../redux/actions/NotificationActions';

const ApprovalModal = ({modal, setModal, data}) => {
  const [indicator, setIndicator] = useState(false);
  const dispatch = useDispatch();

  const onPress = () => {
    setIndicator(true);
    const formData = new FormData();
    formData.append('order_id', data?.orderId);
    productRequests
      .orderApprove(formData)
      .then(res => {
        // console.log('resss',res)
        if (res.status == 200) {
          Toast.show('Order Approved Successfully', Toast.SHORT);
          dispatch(notificationSeen(data?.id));
          setModal(false);
        } else {
          Toast.show('Failed to Approved Order', Toast.SHORT);
        }
      })
      .catch(err => {
        Toast.show('Failed to Approved Order', Toast.SHORT);
      })
      .finally(() => setIndicator(false));
  };

  return (
    <Modal isVisible={modal}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={() => setModal(false)} style={styles.cross}>
          <Icon type="material" name="close" color={colors.white} size={20} />
        </TouchableOpacity>
        <Text style={styles.title}>Order Approval Request</Text>
        <Text numberOfLines={2} style={styles.labelTxt}>
          Coupon Code: <Text style={styles.txt}>{data?.couponCode}</Text>
        </Text>
        <Text numberOfLines={2} style={styles.labelTxt}>
          Product Name: <Text style={styles.txt}>{data?.productName}</Text>
        </Text>
        <Text numberOfLines={2} style={styles.labelTxt}>
          Pharmacy Name: <Text style={styles.txt}>{data?.pharmacyName}</Text>
        </Text>
        <CustomButton
          buttonText={'Approve'}
          width={wp(40)}
          indicator={indicator}
          onPress={onPress}
          containerStyle={{alignSelf: 'center', marginTop: 20}}
        />
      </View>
    </Modal>
  );
};

export default ApprovalModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: wp(90),
    padding: 15,
    paddingTop: 0,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  cross: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.primary,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.mToL,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginVertical: 25,
  },
  labelTxt: {
    color: colors.darkGrey,
    fontSize: fontSize.s,
    fontFamily: fonts.regular,
    marginBottom: 5,
    flexGrow: 1,
  },
  txt: {
    color: colors.black,
    fontSize: fontSize.m,
    fontFamily: fonts.semiBold,
  },
});
