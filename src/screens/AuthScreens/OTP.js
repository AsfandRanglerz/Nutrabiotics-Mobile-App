import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors, fonts, fontSize, wp, hp, regex } from '../../constants/Constants'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import InputField from '../../components/InputField'
import SocialButton from '../../components/SocialButton'
import CustomButton from '../../components/CustomButton'
import Header from '../../components/Header'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { authRequests } from '../../constants/Api'
import Toast from 'react-native-simple-toast'

const CELL_COUNT = 4;

const OTP = () => {

    const navigation = useNavigation()
    const email = useRoute().params?.email
    const [value, setValue] = useState('');
    const [indicator, setIndicator] = useState(false)
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useFocusEffect(() => {
        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(colors.bg)
        }
        StatusBar.setBarStyle('dark-content')
    })

    const resend = () => {
        setIndicator(true)
        const formData = new FormData()
        formData.append('email', email)
        authRequests.forgotPassword(formData)
            .then((res) => {
                Toast.show(res?.data?.message, Toast.SHORT)
            })
            .catch((err) => {
                if (err?.response?.data?.message)
                    Toast.show(err?.response?.data?.message, Toast.SHORT)
            })
            .finally(() => setIndicator(false))
    }
    const verify = () => {
        if (value.length != 4) {
            Toast.show('Please enter your OTP', Toast.SHORT)
        } else {
            setIndicator(true)
            const formData = new FormData()
            formData.append('email', email)
            formData.append('otp', value)
            authRequests.confirmOTP(formData)
                .then((res) => {
                    Toast.show(res?.data?.message, Toast.SHORT)
                    if (res.status == 200) {
                        navigation.replace('ResetPassword',{email})
                    }
                })
                .catch((err) => {
                    if (err?.response?.data?.message)
                        Toast.show(err?.response?.data?.message, Toast.SHORT)
                })
                .finally(() => setIndicator(false))
        }
    }

    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={[styles.center, { paddingBottom: 30 }]} showsVerticalScrollIndicator={false} >
                    <Header heading={'OTP'} />
                    <CodeField
                        ref={ref}
                        {...props}
                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={({ index, symbol, isFocused }) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        )}
                    />
                    <View style={{ flexDirection: 'row', ...styles.center }} >
                        <Text style={styles.txt} >If you don't receive OTP?</Text>
                        <TouchableOpacity disabled={indicator} onPress={resend} >
                            <Text style={[styles.txt, { color: colors.primary }]} > Resend</Text>
                        </TouchableOpacity>
                    </View>
                    <CustomButton
                        buttonText={'Verify'}
                        containerStyle={{ marginVertical: hp(10) }}
                        onPress={verify}
                        indicator={indicator}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OTP

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
    txt: {
        fontFamily: fonts.regular,
        color: colors.darkGrey,
        fontSize: fontSize.s
    },
    root: {
        flex: 1,
        padding: 20
    },
    title: {
        textAlign: 'center',
        fontSize: 30
    },
    codeFieldRoot: {
        marginVertical: hp(10)
    },
    cell: {
        width: 40,
        height: 40,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 1,
        borderColor: colors.grey,
        textAlign: 'center',
        marginHorizontal: 5,
        borderRadius: 5,
        color: colors.secondary
    },
    focusCell: {
        borderColor: colors.primary,
    },
})