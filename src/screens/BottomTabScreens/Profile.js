import {
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
import React, {useEffect, useState} from 'react';
import {colors, fonts, fontSize, wp} from '../../constants/Constants';
import Header from '../../components/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Icon} from '@rneui/themed';
import InputField from '../../components/InputField';
import KeyboardResponsiveModal from '../../components/KeyboardResponsiveModal';
import CustomButton from '../../components/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaView} from 'react-native';
import {authRequests, productRequests} from '../../constants/Api';
import {ActivityIndicator} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {addUpdateUser} from '../../redux/actions/UserActions';
import DropDown from '../../components/DropDown';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const CustomView = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.customView}>
      <Text style={styles.customViewLabel}>{props.label}</Text>
      {props.indicator ? (
        <ActivityIndicator size={15} color={colors.darkGrey} />
      ) : (
        <Icon
          type={'material'}
          name={'chevron-right'}
          color={colors.darkGrey}
        />
      )}
    </TouchableOpacity>
  );
};
const Line = () => {
  return <View style={styles.line} />;
};

const Profile = () => {
  const navigation = useNavigation();
  const USER_COUNTRY = useSelector(
    state => state?.UserLocationReducer?.country,
  );
  const [modal, setModal] = useState(false);
  const [name, setName] = useState(null);
  const [changeFocus, setChangeFocus] = useState(false);
  const [logoutIndicator, setLogoutIndicator] = useState(false);
  const [updateIndicator, setUpdateIndicator] = useState(false);
  const [image, setImage] = useState(null);
  // const [countries, setCountries] = useState([]);
  // const [countriesIndicator, setCountriesIndicator] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState(null);
  const userData = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  // const getCountries = () => {
  //   setCountriesIndicator(true);
  //   authRequests
  //     .getCountries()
  //     .then(res => {
  //       if (res.status == 200) {
  //         const data =
  //           res?.data?.successData?.map(item => {
  //             return {
  //               id: item?.id,
  //               label: item?.name,
  //               value: item?.name,
  //             };
  //           }) || [];
  //         setCountries(data);
  //       }
  //     })
  //     .catch(err => console.log(err))
  //     .finally(() => setCountriesIndicator(false));
  // };

  // useEffect(() => {
  //   getCountries();
  // }, []);

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });

  const imagePick = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 250,
        maxHeight: 250,
      },
      e => {
        if (e?.assets) {
          const object = e.assets[0];
          setImage({
            uri: object.uri,
            name: object.fileName,
            type: object.type,
          });
        }
      },
    );
  };

  const logout = async () => {
    setLogoutIndicator(true);
    const isGoogleSignedIn = await GoogleSignin.isSignedIn();
    if (isGoogleSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      authRequests
        .logout()
        .then(res => {
          Toast.show(res?.data?.message, Toast.SHORT);
          if (res.status == 200) {
            dispatch(addUpdateUser(null));
            navigation.navigate('Home');
          }
        })
        .catch(err => {
          if (err?.response?.data?.message)
            Toast.show(err?.response?.data?.message, Toast.SHORT);
        })
        .finally(() => setLogoutIndicator(false));
    } else {
      authRequests
        .logout()
        .then(res => {
          Toast.show(res?.data?.message, Toast.SHORT);
          if (res.status == 200) {
            dispatch(addUpdateUser(null));
            navigation.navigate('Home');
          }
        })
        .catch(err => {
          if (err?.response?.data?.message)
            Toast.show(err?.response?.data?.message, Toast.SHORT);
        })
        .finally(() => setLogoutIndicator(false));
    }
  };
  const updateProfile = () => {
    setUpdateIndicator(true);
    const formData = new FormData();
    formData.append('name', name);
    // formData.append('country_id', selectedCountry?.id);
    formData.append('country_id', '');
    image && formData.append('image', image);
    productRequests
      .updateProfile(formData)
      .then(res => {
        Toast.show(res?.data?.message, Toast.SHORT);
        if (res.status == 200) {
          dispatch(
            addUpdateUser({
              ...res?.data?.successData?.data,
              token: userData?.token,
            }),
          );
          setModal(false);
        }
      })
      .catch(err => {
        if (err?.response?.data?.message)
          Toast.show(err?.response?.data?.message, Toast.SHORT);
      })
      .finally(() => setUpdateIndicator(false));
  };
  useEffect(() => {
    setName(userData?.name);
    // setSelectedCountry({
    //   id: userData?.country?.id,
    //   label: userData?.country?.name,
    //   value: userData?.country?.name,
    // });
  }, [userData]);

  useEffect(() => {
    setImage(null);
  }, [modal]);

  return (
    <SafeAreaView style={[styles.container, styles.center]}>
      {/* Edit Profile modal */}
      <KeyboardResponsiveModal
        isVisible={modal}
        onBackButtonPress={() => setModal(false)}
        onBackdropPress={() => setChangeFocus(!changeFocus)}>
        <Pressable
          onPress={() => setChangeFocus(!changeFocus)}
          style={styles.modalCont}>
          {/* Cross Button */}
          <TouchableOpacity
            style={styles.cross}
            onPress={() => setModal(false)}>
            <Icon
              type={'material'}
              name={'close'}
              color={colors.white}
              size={20}
            />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                borderRadius: styles.profileImgEdit.borderRadius,
                marginVertical: wp(7),
                alignSelf: 'center',
              }}>
              <View style={styles.profileImgEditView}>
                <Image
                  resizeMode="contain"
                  source={
                    image
                      ? {uri: image.uri}
                      : userData?.image
                      ? {uri: userData?.image}
                      : require('../../assets/images/dummy-profile.png')
                  }
                  style={styles.profileImgEdit}
                />
              </View>
              {/* Camera Icon */}
              <TouchableOpacity
                onPress={imagePick}
                style={[styles.cross, {top: -5, right: -5}]}>
                <Icon
                  type={'material'}
                  name={'photo-camera'}
                  color={colors.white}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <InputField
              mainContainerStyle={{
                width: wp(90) - 20,
                marginBottom: wp(7),
              }}
              inputContainerStyle={{width: wp(90) - 30}}
              changeFocus={changeFocus}
              heading={'Name'}
              value={name}
              setValue={e => setName(e)}
              placeholder={'Enter Name'}
              leftIconName={'person-outline'}
              leftIconType={'material'}
            />
            {/* <DropDown
              mainContainerStyle={{
                width: wp(90) - 20,
                marginBottom: wp(7),
              }}
              inputContainerStyle={{width: wp(90) - 30}}
              heading={'Country'}
              value={selectedCountry}
              setValue={setSelectedCountry}
              placeholder={'Select country'}
              leftIconName={'outlined-flag'}
              leftIconType={'material'}
              data={countries}
              indicator={countriesIndicator}
              dropdownPosition={'top'}
            /> */}
            {/* <InputField
              mainContainerStyle={{ width: wp(90) - 20 }}
              inputContainerStyle={{ width: wp(90) - 30 }}
              changeFocus={changeFocus}
              heading={'Email'}
              value={updateProfileData?.email}
              setValue={(e) => {
                setUpdateProfileData((prev) => {
                  // console.log('thisss')
                  console.log(prev)
                  return { ...prev, email: e }
                })
              }}
              placeholder={'Enter email'}
              leftIconName={'mail-outline'}
              leftIconType={'material'}
            /> */}
          </ScrollView>
          <CustomButton
            containerStyle={{marginVertical: 10}}
            buttonText={'Update'}
            width={wp(30)}
            onPress={updateProfile}
            indicator={updateIndicator}
          />
        </Pressable>
      </KeyboardResponsiveModal>

      <ScrollView
        contentContainerStyle={[styles.center, {paddingBottom: wp(25)}]}
        showsVerticalScrollIndicator={false}>
        <Header heading={'Profile'} hideBackButton={true} />
        <View style={styles.headingCont}>
          <View style={styles.profileImgView}>
            <Image
              resizeMode="contain"
              style={styles.profileImg}
              source={
                userData?.image
                  ? {uri: userData?.image}
                  : require('../../assets/images/dummy-profile.png')
              }
            />
          </View>
          <View>
            <Text style={styles.name}>{userData?.name}</Text>
            <Text style={styles.email}>{userData?.email}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={'flag'}
            type={'material'}
            color={colors.primary}
            size={20}
          />
          {/* <Text style={styles.country}>{userData?.country?.name || 'N/A'}</Text> */}
          <Text style={styles.country}>{USER_COUNTRY || 'N/A'}</Text>
        </View>
        <TouchableOpacity onPress={() => setModal(true)} style={styles.btn}>
          <Text style={styles.btnTxt}>Edit Profile</Text>
        </TouchableOpacity>
        <CustomView
          label={'Notifications'}
          onPress={() => navigation.navigate('Notifications')}
        />
        <CustomView
          label={'My Coupens'}
          onPress={() => navigation.navigate('Coupens')}
        />
        <Line />
        <CustomView
          label={'Privacy Policy'}
          onPress={() => {
            navigation.navigate('PrivacyPolicy');
          }}
        />
        <CustomView
          label={'About Us'}
          onPress={() => {
            navigation.navigate('AboutUs');
          }}
        />
        <CustomView
          label={'Terms & Conditions'}
          onPress={() => {
            navigation.navigate('TermsConditions');
          }}
        />
        <CustomView
          label={'How To Order'}
          onPress={() => {
            navigation.navigate('HowToOrder');
          }}
        />
        <Line />
        <CustomView
          label={'Change Password'}
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <CustomView
          indicator={logoutIndicator}
          label={'Logout'}
          onPress={logout}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingCont: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImg: {
    height: wp(16) - 4,
    width: wp(16) - 4,
    borderRadius: wp(8) - 2,
  },
  profileImgView: {
    height: wp(16),
    width: wp(16),
    borderRadius: wp(8),
    marginRight: wp(4),
    borderColor: colors.primary,
    borderWidth: 2,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: fontSize.l,
    color: colors.secondary,
  },
  email: {
    fontFamily: fonts.medium,
    fontSize: fontSize.s,
    color: colors.secondary,
  },
  country: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    color: colors.secondary,
    marginVertical: 20,
    marginTop: 15,
    marginLeft: 5,
    transform: [{translateY: 2}],
  },
  btn: {
    padding: wp(3),
    paddingHorizontal: wp(5),
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginBottom: 20,
  },
  btnTxt: {
    fontFamily: fonts.medium,
    fontSize: fontSize.s,
    color: colors.white,
  },
  customView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(90),
    justifyContent: 'space-between',
    backgroundColor: colors.lightGrey,
    borderRadius: 20,
    paddingHorizontal: wp(4),
    marginBottom: 10,
  },
  customViewLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSize.s,
    color: colors.secondary,
    marginVertical: wp(3),
  },
  line: {
    width: wp(85),
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 20,
  },
  modalCont: {
    width: wp(90),
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cross: {
    backgroundColor: colors.primary,
    padding: 5,
    height: 30,
    width: 30,
    borderRadius: 15,
    position: 'absolute',
    top: 5,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  profileImgEdit: {
    height: wp(25) - 4,
    width: wp(25) - 4,
    borderRadius: wp(13) - 2,
  },
  profileImgEditView: {
    height: wp(25),
    width: wp(25),
    borderRadius: wp(13),
    borderColor: colors.primary,
    borderWidth: 2,
  },
});
