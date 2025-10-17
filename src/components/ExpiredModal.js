import {Linking, StyleSheet, Text, View} from 'react-native';
import CustomButton from './CustomButton';
import Modal from 'react-native-modal';
import {colors, fontSize, fonts, wp} from '../constants/Constants';
import {useDispatch} from 'react-redux';
import {notificationSeen} from '../redux/actions/NotificationActions';
import {useState} from 'react';

const ExpiredModal = ({modal, setModal, data}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const onPress = async () => {
    setLoader(true);
    try {
      await setModal(false);
      dispatch(notificationSeen(data?.id));
      Linking.openURL(`nutrabiotics://pro_detail/${data?.productId}`);
    } catch (error) {
      console.error('An error occurred in onPress:', error);
    }
    setLoader(false);
  };

  return (
    <Modal isVisible={modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{data?.title}</Text>

        <Text numberOfLines={2} style={styles.txt}>
          {data?.description}
        </Text>
        <CustomButton
          buttonText={'Ok'}
          width={wp(40)}
          indicator={loader}
          onPress={onPress}
          containerStyle={{alignSelf: 'center', marginTop: 20}}
        />
      </View>
    </Modal>
  );
};

export default ExpiredModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: wp(90),
    padding: 15,
    paddingTop: 0,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.primary,
    fontSize: fontSize.mToL,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginVertical: 25,
  },
  txt: {
    color: colors.black,
    fontSize: fontSize.m,
    fontFamily: fonts.semiBold,
  },
});
