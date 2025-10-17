import {
  Image,
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
import React, { useState } from 'react';
import {
  colors,
  fonts,
  fontSize,
  hp,
  regex,
  wp,
} from '../../constants/Constants';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import SocialButton from '../../components/SocialButton';
import { authRequests, configureDefaultHeaders } from '../../constants/Api';
import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import { addUpdateUser } from '../../redux/actions/UserActions';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { getMessaging } from '@react-native-firebase/messaging';

const Login = () => {
  // const [email, setEmail] = useState('tayyab1.ranglerz@gmail.com');
  // const [password, setPassword] = useState('gggggg');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [indicator, setIndicator] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const params = useRoute().params;

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });

  GoogleSignin.configure({
    webClientId:
      '227561691418-2tcncdd2cvsjutu53o6umdb2hkf6omuc.apps.googleusercontent.com',
  });

  const login = async () => {
    if (!email) {
      Toast.show('Please enter your email', Toast.SHORT);
    } else if (!regex.email.test(email)) {
      Toast.show('Please enter valid email', Toast.SHORT);
    } else if (!password) {
      Toast.show('Please enter your password', Toast.SHORT);
    } else if (password.length < 6) {
      Toast.show('Password must be atleast 6 characters', Toast.SHORT);
    } else {
      setIndicator(true);
      await getMessaging().registerDeviceForRemoteMessages();
      const token = await getMessaging().getToken();
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('fcm_token', token);
      authRequests
        .login(formData)
        .then(res => {
          Toast.show(res?.data?.message, Toast.SHORT);
          if (res.status == 200) {
            configureDefaultHeaders(res?.data?.successData?.user?.token);
            dispatch(addUpdateUser(res?.data?.successData?.user));
            if (params?.goBack) {
              navigation.goBack();
            } else {
              navigation.navigate('BottomTab');
            }
          }
        })
        .catch(err => {
          if (err?.response?.data?.message)
            Toast.show(err?.response?.data?.message, Toast.SHORT);
        })
        .finally(() => setIndicator(false));
    }
  };
  const googleLogin = async () => {
    try {
      const check = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!check) {
        return true;
      }
      const res = await GoogleSignin.signIn();
      console.log('res', res?.data);
      const obj = {
        social_id: res?.data?.user?.id,
        email: res?.data?.user?.email,
        name: res?.data?.user?.name,
        image: res?.data?.user?.photo,
      };
      console.log('obj', obj);
      socialLoginApiCall(obj);
    } catch (error) {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Toast.show(
          'Google Play Services is not available in your device',
          Toast.SHORT,
        );
      } else {
        Toast.show('Error occured while google login', Toast.SHORT);
      }
    }
  };

  const socialLoginApiCall = async data => {
    const token = await getMessaging().getToken();
    let formData = new FormData();
    formData.append('social_id', data?.social_id);
    formData.append('login_type', 'google');
    data?.email && formData.append('email', data?.email);
    data?.name && formData.append('name', data?.name);
    formData.append('fcm_token', token);
    authRequests
      .social_login(formData)
      // .then(res => res.json())
      .then(async res => {
        Toast.show(res?.data?.message, Toast.SHORT);
        if (res.status == 200) {
          // console.log('res', res.data);
          configureDefaultHeaders(res?.data?.successData?.user?.token);
          dispatch(addUpdateUser(res?.data?.successData?.user));
          if (params?.goBack) {
            navigation.goBack();
          } else {
            navigation.navigate('BottomTab');
          }
        }
      })
      .catch(async error => {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        // error?.response?.data?.message &&
        Toast.show(error.response.data.message, Toast.SHORT);
        console.log('error while SignIn', error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.innerContainer, { justifyContent: 'center' }]}>
            <Image
              source={require('../../assets/images/app_logo.png')}
              resizeMode="contain"
            />
            {/* <Text style={styles.logoText}>Nutrabiotics</Text> */}
            <View style={[styles.center, { marginTop: hp(7) }]}>
              <Text style={styles.semiboldTxt}>Welcome</Text>
              <Text style={styles.txt}>Login to your account</Text>
            </View>
          </View>
          <View style={[styles.innerContainer, { justifyContent: 'center' }]}>
            <InputField
              heading={'Email'}
              value={email}
              setValue={setEmail}
              placeholder={'Enter email'}
              leftIconName={'mail-outline'}
              leftIconType={'material'}
            />
            <InputField
              heading={'Password'}
              secure={true}
              value={password}
              setValue={setPassword}
              placeholder={'Enter password'}
              leftIconName={'lock-outline'}
              leftIconType={'material'}
              mainContainerStyle={{ marginBottom: 5 }}
            />
            <View style={styles.forgotPassCont}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPassTxt}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <CustomButton
              buttonText={'Sign in'}
              width={wp(40)}
              indicator={indicator}
              onPress={login}
            />
            <View style={{ flexDirection: 'row', ...styles.center }}>
              <Text style={styles.forgotPassTxt}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={[styles.forgotPassTxt, { color: colors.primary }]}>
                  {' '}
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  ...styles.center,
                }}
              >
                <View style={styles.line} />
                <Text
                  style={[
                    styles.forgotPassTxt,
                    { transform: [{ translateY: -1.5 }] },
                  ]}
                >
                  {' '}
                  or sign in with{' '}
                </Text>
                <View style={styles.line} />
              </View>
              <View style={{ marginTop: 5, alignSelf: 'center' }}>
                <SocialButton type={'google'} onPress={googleLogin} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    backgroundColor: colors.bg,
    alignItems: 'center',
  },

  logoText: {
    fontFamily: fonts.bold,
    fontSize: fontSize.xxl,
    color: colors.primary,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
  forgotPassTxt: {
    fontFamily: fonts.regular,
    color: colors.darkGrey,
    fontSize: fontSize.s,
  },
  forgotPassCont: {
    alignItems: 'flex-end',
    width: wp(90),
    paddingHorizontal: 15,
  },
  line: {
    width: 30,
    height: 1,
    backgroundColor: colors.grey,
  },
});
