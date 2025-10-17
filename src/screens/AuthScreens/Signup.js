import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  colors,
  fonts,
  fontSize,
  wp,
  hp,
  regex,
} from '../../constants/Constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import InputField from '../../components/InputField';
import SocialButton from '../../components/SocialButton';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
import { authRequests, configureDefaultHeaders } from '../../constants/Api';
import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import { addUpdateUser } from '../../redux/actions/UserActions';
import messaging from '@react-native-firebase/messaging';
import DropDown from '../../components/DropDown';
import { Image } from 'react-native';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [countries, setCountries] = useState([]);
  // const [countriesIndicator, setCountriesIndicator] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState(null);
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const [indicator, setIndicator] = useState(false);
  const navigation = useNavigation();
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
  const register = async () => {
    if (!name) {
      Toast.show('Please enter your name', Toast.SHORT);
    } else if (!email) {
      Toast.show('Please enter your email', Toast.SHORT);
    } else if (!regex.email.test(email)) {
      Toast.show('Please enter valid email', Toast.SHORT);
      // } else if (!selectedCountry) {
      //   Toast.show('Please select your country', Toast.SHORT);
    } else if (!password) {
      Toast.show('Please enter your password', Toast.SHORT);
    } else if (password.length < 6) {
      Toast.show('Password must be atleast 6 characters', Toast.SHORT);
    } else if (!cnfPassword) {
      Toast.show('Please enter confirm password', Toast.SHORT);
    } else if (password != cnfPassword) {
      Toast.show('Confirm password does not match', Toast.SHORT);
    } else {
      setIndicator(true);
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      // formData.append('country_id', selectedCountry?.id);
      formData.append('country_id', '');
      formData.append('password', password);
      formData.append('password_confirmation', cnfPassword);
      formData.append('fcm_token', token);
      authRequests
        .register(formData)
        .then(res => {
          Toast.show(res?.data?.message, Toast.SHORT);
          if (res.status == 200) {
            configureDefaultHeaders(res?.data?.successData?.user?.token);
            dispatch(addUpdateUser(res?.data?.successData?.user));
            navigation.navigate('BottomTab');
          }
        })
        .catch(err => {
          console.log('@ERROR in SIgnup', JSON.stringify(err, null, 2));
          if (err?.response?.data?.message)
            Toast.show(err?.response?.data?.message, Toast.SHORT);
        })
        .finally(() => setIndicator(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        contentContainerStyle={{ flex: 1 }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.center,
            { paddingBottom: 30, flexGrow: 1 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Header />
          <Image
            source={require('../../assets/images/app_logo.png')}
            resizeMode="contain"
          />
          {/* <Text style={styles.logoText}>Nutrabiotics</Text> */}
          <View>
            <InputField
              heading={'Name'}
              value={name}
              setValue={setName}
              placeholder={'Enter Name'}
              leftIconName={'person-outline'}
              leftIconType={'material'}
            />
            <InputField
              heading={'Email'}
              value={email}
              setValue={setEmail}
              placeholder={'Enter email'}
              leftIconName={'mail-outline'}
              leftIconType={'material'}
            />
            {/* <DropDown
              heading={'Country'}
              value={selectedCountry}
              setValue={setSelectedCountry}
              placeholder={'Select country'}
              leftIconName={'outlined-flag'}
              leftIconType={'material'}
              data={countries}
              indicator={countriesIndicator}
            /> */}
            <InputField
              heading={'Password'}
              secure={true}
              value={password}
              setValue={setPassword}
              placeholder={'Enter password'}
              leftIconName={'lock-outline'}
              leftIconType={'material'}
            />
            <InputField
              heading={'Confirm Password'}
              secure={true}
              value={cnfPassword}
              setValue={setCnfPassword}
              placeholder={'Enter confirm password'}
              leftIconName={'lock-outline'}
              leftIconType={'material'}
            />
          </View>
          <View style={styles.innerContainer}>
            <CustomButton
              buttonText={'Sign up'}
              width={wp(40)}
              containerStyle={{ marginTop: 30 }}
              onPress={register}
              indicator={indicator}
            />
            <View
              style={{
                flexDirection: 'row',
                ...styles.center,
                marginTop: 30,
              }}
            >
              <Text style={styles.alreadyAccountTxt}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  style={[styles.alreadyAccountTxt, { color: colors.primary }]}
                >
                  {' '}
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{ marginTop: 30 }} >
                            <View style={{ flexDirection: 'row', ...styles.center }} >
                                <View style={styles.line} />
                                <Text style={[styles.alreadyAccountTxt, { transform: [{ translateY: -1.5 }] }]}> or sign in with </Text>
                                <View style={styles.line} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                <SocialButton type={'google'} />
                                <SocialButton type={'facebook'} />
                            </View>
                        </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.primary,
    marginVertical: hp(7),
    marginBottom: hp(10),
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor:'red'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  semiboldTxt: {
    fontFamily: fonts.bold,
    fontSize: fontSize.m,
    color: colors.secondary,
  },
  txt: {
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.secondary,
  },
  alreadyAccountTxt: {
    fontFamily: fonts.regular,
    color: colors.darkGrey,
    fontSize: fontSize.s,
  },
  line: {
    width: 30,
    height: 1,
    backgroundColor: colors.grey,
  },
  socialButton: {
    padding: 10,
    backgroundColor: colors.white,
    elevation: 10,
    borderRadius: 10,
    marginHorizontal: wp(5),
  },
  socialButtonImage: {
    width: wp(7),
    height: wp(7),
  },
});
