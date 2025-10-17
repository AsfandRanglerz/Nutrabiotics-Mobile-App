import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts, fontSize, wp, hp } from '../../constants/Constants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import InputField from '../../components/InputField'
import SocialButton from '../../components/SocialButton'
import CustomButton from '../../components/CustomButton'
import Header from '../../components/Header'
import { SafeAreaView } from 'react-native'
import { authRequests } from '../../constants/Api'
import Toast from 'react-native-simple-toast'

const ChangePassword = () => {

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [cnfNewPassword, setCnfNewPassword] = useState('')
    const [indicator, setIndicator] = useState(false)
    const navigation = useNavigation()

    const submit = () => {
        if (!currentPassword) {
            Toast.show('Please enter current password', Toast.SHORT)
        } else if (!newPassword) {
            Toast.show('Please enter new password', Toast.SHORT)
        } else if (newPassword.length < 6) {
            Toast.show('Password must be atleast 6 characters', Toast.SHORT)
        } else if (!cnfNewPassword) {
            Toast.show('Please enter confirm password', Toast.SHORT)
        } else if (newPassword != cnfNewPassword) {
            Toast.show('Confirm password does not match', Toast.SHORT)
        } else {
            setIndicator(true)
            const formData = new FormData()
            formData.append('current_password', currentPassword)
            formData.append('new_password', newPassword)
            formData.append('confirm_password', cnfNewPassword)
            authRequests.changePassword(formData)
                .then((res) => {
                    Toast.show(res?.data?.message, Toast.SHORT)
                    if (res.status == 200) {
                        navigation.goBack()
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
            <ScrollView contentContainerStyle={[styles.center, { paddingBottom: 30 }]} showsVerticalScrollIndicator={false} >
                <Header heading={'Change Password'} />
                <InputField
                    heading={'Current Password'}
                    value={currentPassword}
                    setValue={setCurrentPassword}
                    placeholder={'Enter current password'}
                    leftIconName={'lock-outline'}
                    leftIconType={'material'}
                    secure={true}
                    mainContainerStyle={{ marginTop: hp(10) }}
                />
                <InputField
                    heading={'New Password'}
                    value={newPassword}
                    setValue={setNewPassword}
                    placeholder={'Enter new password'}
                    leftIconName={'lock-outline'}
                    leftIconType={'material'}
                    secure={true}
                />
                <InputField
                    heading={'Confirm New Password'}
                    value={cnfNewPassword}
                    setValue={setCnfNewPassword}
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
        </SafeAreaView>
    )
}

export default ChangePassword

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