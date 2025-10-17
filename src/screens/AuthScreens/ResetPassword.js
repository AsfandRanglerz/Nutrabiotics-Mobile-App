import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts, fontSize, wp, hp } from '../../constants/Constants'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import InputField from '../../components/InputField'
import SocialButton from '../../components/SocialButton'
import CustomButton from '../../components/CustomButton'
import Header from '../../components/Header'
import { authRequests } from '../../constants/Api'
import Toast from 'react-native-simple-toast'

const ResetPassword = () => {

    const [password, setPassword] = useState('')
    const [cnfPassword, setCnfPassword] = useState('')
    const [indicator, setIndicator] = useState(false)
    const email = useRoute().params?.email
    const navigation = useNavigation()

    const submit = () => {
        if (!password) {
            Toast.show('Please enter your password', Toast.SHORT)
        } else if (password.length < 6) {
            Toast.show('Password must be atleast 6 characters', Toast.SHORT)
        } else if (!cnfPassword) {
            Toast.show('Please enter confirm password', Toast.SHORT)
        } else if (password != cnfPassword) {
            Toast.show('Confirm password does not match', Toast.SHORT)
        } else {
            setIndicator(true)
            const formData = new FormData()
            formData.append('email', email)
            formData.append('password', password)
            formData.append('password_confirmation', cnfPassword)
            authRequests.resetPassword(formData)
                .then((res) => {
                    Toast.show(res?.data?.message, Toast.SHORT)
                    if (res.status == 200) {
                        navigation.popToTop()
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
                <Header heading={'Reset Password'} />
                <InputField
                    heading={'New Password'}
                    value={password}
                    setValue={setPassword}
                    placeholder={'Enter new password'}
                    leftIconName={'lock-outline'}
                    leftIconType={'material'}
                    mainContainerStyle={{ marginTop: hp(10) }}
                    secure={true}
                />
                <InputField
                    heading={'Confirm New Password'}
                    value={cnfPassword}
                    setValue={setCnfPassword}
                    placeholder={'Re-Enter new password'}
                    leftIconName={'lock-outline'}
                    leftIconType={'material'}
                    secure={true}
                />
                <CustomButton
                    buttonText={'Submit'}
                    containerStyle={{ marginVertical: hp(10) }}
                    onPress={submit}
                    indicator={indicator}
                />
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ResetPassword

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