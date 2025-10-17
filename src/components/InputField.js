import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { colors, fonts, fontSize, wp } from '../constants/Constants'
import { Icon } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'

const InputField = (props) => {

    const [focus, setFocus] = useState(false)
    const [doneBtn, setDoneBtn] = useState(false)
    const [visibility, setVisibility] = useState(false)
    const focusRef = useRef()

    useEffect(() => {
        props.changeFocus && focusRef.current?.blur()
    }, [props.changeFocus])
    useEffect(() => {
        setTimeout(() => {
            focusRef.current?.focus()
        },10)
    }, [])

    return (
        <View style={[{ width: wp(90), marginBottom: 10 }, { ...props.mainContainerStyle }]} >
            {props.heading ?
                <Text style={styles.heading} >{props.heading}</Text> : null
            }
            <View style={{ padding: 5 }} >
                {props.dummy ?

                    // dummy search bar
                    <Pressable onPress={props.onPress} style={[styles.container, { borderColor: focus ? colors.primary : colors.lightGrey }, props.inputContainerStyle]} >
                        {props.leftIconName ?
                            <View style={styles.beforeInpCont} >
                                <Icon
                                    name={props.leftIconName}
                                    type={props.rightIconName ? props.rightIconName : 'material'}
                                    color={focus ? colors.primary : (props.leftIconColor ? props.leftIconColor : colors.secondary)}
                                    size={20}
                                />
                            </View> : null
                        }
                        <View style={styles.input}>
                            <Text style={{ color: colors.placeHolder, fontSize: fontSize.s, paddingVertical: 5 }}>{props.placeholder}</Text>
                        </View>
                    </Pressable>

                    :

                    <View style={[styles.container, { borderColor: focus ? colors.primary : colors.lightGrey }, props.inputContainerStyle]} >
                        {props.leftIconName ?
                            <View style={styles.beforeInpCont} >
                                <Icon
                                    name={props.leftIconName}
                                    type={props.rightIconName ? props.rightIconName : 'material'}
                                    color={focus ? colors.primary : (props.leftIconColor ? props.leftIconColor : colors.secondary)}
                                    size={20}
                                />
                            </View> : null
                        }
                        <TextInput
                            ref={focusRef}
                            style={styles.input}
                            placeholder={props.placeholder}
                            placeholderTextColor={colors.placeHolder}
                            value={props.value}
                            onChangeText={(e) => {
                                props.setValue(e)
                                props.search && setDoneBtn(true)
                            }}
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                            selectionColor={colors.primary}
                            secureTextEntry={props.secure ? !visibility : false}
                            onSubmitEditing={() => {
                                if (props.search) {
                                    setDoneBtn(false)
                                    props.onSubmitEditing()
                                }
                            }}
                        />
                        {props.search && doneBtn && props.value && !props.indicator ?
                            <TouchableOpacity
                                disabled={props.indicator}
                                onPress={() => {
                                    focusRef.current?.blur()
                                    setDoneBtn(false)
                                    props.onSubmitEditing()
                                }}
                                style={styles.afterInpCont}
                            >
                                <Text style={styles.doneBtn} >Done</Text>
                            </TouchableOpacity>
                            :
                            props.secure ?
                                <TouchableOpacity onPress={() => setVisibility(!visibility)} style={styles.afterInpCont} >
                                    <Icon
                                        name={visibility ? 'visibility' : 'visibility-off'}
                                        type={'material'}
                                        color={visibility ? colors.primary : colors.secondary}
                                        size={20}
                                    />
                                </TouchableOpacity> : null
                        }

                    </View>
                }
            </View>
        </View>
    )
}

export default InputField

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 5,
        elevation: 3,
        shadowOffset: { width: 2, height: 3 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderWidth: 0.5,
        padding: wp(2)
    },
    beforeInpCont: {
        paddingRight: wp(2)
    },
    afterInpCont: {
        paddingLeft: wp(2)
    },
    input: {
        width: '100%',
        color: colors.secondary,
        fontSize: fontSize.s,
        flex: 1,
        padding: 0
    },
    heading: {
        color: colors.secondary,
        fontFamily: fonts.semiBold,
        marginLeft: 15,
        fontSize: fontSize.m
    },
    doneBtn: {
        color: '#0047ab',
        fontFamily: fonts.semiBold,
        fontSize: fontSize.s
    }
})