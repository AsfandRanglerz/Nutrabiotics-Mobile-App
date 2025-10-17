import {
  FlatList,
  Image,
  Platform,
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
  NotificationsData,
  wp,
} from '../../constants/Constants';
import Header from '../../components/Header';
import {Icon} from '@rneui/themed';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {notificationSeen} from '../../redux/actions/NotificationActions';
import ApprovalModal from '../../components/ApprovalModal';

const Notifications = () => {
  const notifications = useSelector(state => state.NotificationReducer);
  const [approvalModal, setApprovalModal] = useState(false);
  const [approvalModalData, setApprovalModalData] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header heading={'Notifications'} />
        {notifications?.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item, index) => item?.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{width: wp(90)}}
            ListHeaderComponentStyle={{height: 10}}
            ListHeaderComponent={<View />}
            ListFooterComponentStyle={{height: 10}}
            ListFooterComponent={<View />}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    // if (item?.title == 'Deal') {
                    //   dispatch(notificationSeen(item?.id));
                    //   navigation.navigate('ProDetail', {id: item?.productId});
                    // } else
                    if (item?.title == 'Order Expired') {
                      dispatch(notificationSeen(item?.id));
                      navigation.navigate('ProDetail', {
                        id: item?.description?.productId?.[0]?.toString(),
                      });
                    } else {
                      if (!item?.seen) {
                        setApprovalModalData(item);
                        setApprovalModal(true);
                      }
                    }
                  }}
                  style={[
                    styles.notificationCont,
                    {
                      backgroundColor: item?.seen
                        ? colors.openedNotificationBackgroundColor
                        : colors.notificationBackgroundColor,
                    },
                  ]}>
                  <Icon
                    type="material"
                    name={item?.seen ? 'drafts' : 'email'}
                    color={item?.seen ? colors.darkGrey : colors.primary}
                    size={wp(8)}
                    style={styles.icon}
                  />
                  <View style={{flex: 1}}>
                    <View style={styles.firstCont}>
                      <Text numberOfLines={1} style={styles.title}>
                        {item?.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.date}>
                        {item?.date}
                      </Text>
                    </View>
                    <Text numberOfLines={2} style={styles.name}>
                      {/* {item?.title == 'Deal'
                        ? `${item?.description?.message}`
                        : //  `${item?.productDiscountPer}% OFF on ${item?.productName}`
                          item?.productName} */}
                      {item?.title == 'Order Expired'
                        ? `${item?.description?.message}`
                        : item?.productName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={{flex: 1, ...styles.center}}>
            <Text style={styles.txt}>No Data Found</Text>
          </View>
        )}
      </SafeAreaView>
      <ApprovalModal
        modal={approvalModal}
        setModal={setApprovalModal}
        data={approvalModalData}
      />
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  icon: {
    height: wp(10),
    width: wp(10),
    marginRight: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCont: {
    flexDirection: 'row',
    width: wp(90),
    alignItems: 'center',
    marginTop: wp(2),
    padding: wp(2),
    borderRadius: 30,
    flex: 1,
  },
  firstCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xs,
    color: colors.darkGrey,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
    color: colors.primary,
    flex: 1,
  },
  name: {
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.darkGrey,
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: fonts.medium,
    fontSize: fontSize.s,
    color: colors.darkGrey,
  },
});
