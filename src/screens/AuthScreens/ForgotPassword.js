import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts, fontSize, wp, hp, regex } from '../../constants/Constants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import InputField from '../../components/InputField'
import SocialButton from '../../components/SocialButton'
import CustomButton from '../../components/CustomButton'
import Header from '../../components/Header'
import { SafeAreaView } from 'react-native'
import { authRequests } from '../../constants/Api'
import Toast from 'react-native-simple-toast'

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const navigation = useNavigation()
    const [indicator, setIndicator] = useState(false)

    const send = () => {
        if (!email) {
            Toast.show('Please enter your email', Toast.SHORT)
        } else if (!regex.email.test(email)) {
            Toast.show('Please enter valid email', Toast.SHORT)
        } else {
            setIndicator(true)
            const formData = new FormData()
            formData.append('email', email)
            authRequests.forgotPassword(formData)
                .then((res) => {
                    Toast.show(res?.data?.message, Toast.SHORT)
                    if (res.status == 200) {
                        navigation.navigate('OTP',{email})
                    }
                })
                .catch((err) => {
                    if (err?.response?.data?.message)
                    Toast.show(err?.response?.data?.message, Toast.SHORT)
                })
                .finally(() => setIndicator(false))
        }
    }
    useFocusEffect(() => {
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(colors.bg)
        }
        StatusBar.setBarStyle('dark-content')
    })

    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={[styles.center, { paddingBottom: 30 }]} showsVerticalScrollIndicator={false} >
                    <Header heading={'Forgot Password'} />
                    <InputField
                        heading={'Email'}
                        value={email}
                        setValue={setEmail}
                        placeholder={'Enter email'}
                        leftIconName={'mail-outline'}
                        leftIconType={'material'}
                        mainContainerStyle={{ marginTop: hp(10) }}
                    />
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Text style={styles.backTxt} >Back to Sign in</Text>
                    </TouchableOpacity>
                    <CustomButton
                        buttonText={'Send'}
                        containerStyle={{ marginVertical: hp(10) }}
                        onPress={send}
                        indicator={indicator}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        alignItems: 'center'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    backTxt: {
        fontFamily: fonts.regular,
        color: colors.primary,
        fontSize: fontSize.s
    },
})