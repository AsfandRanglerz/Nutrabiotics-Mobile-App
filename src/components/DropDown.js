import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { colors, fontSize, fonts, wp } from '../constants/Constants';
import { Icon } from '@rneui/themed'
const renderItem = item => {
    return (
        <View style={styles.item}>
            <Text numberOfLines={1} style={styles.textItem}>{item.label}</Text>
        </View>
    );
};
const DropDown = (props) => {

    const [focus, setFocus] = useState(false);

    return (
        <View style={[{ width: wp(90), marginBottom: 10 }, { ...props.mainContainerStyle }]} >
            {props.heading ?
                <Text style={styles.heading} >{props.heading}</Text> : null
            }
            <View style={{ padding: 5 }} >
                <Dropdown
                    style={[styles.container, { borderColor: focus ? colors.primary : colors.lightGrey }, props.inputContainerStyle]}
                    containerStyle={{ borderRadius: 5 }}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={props.data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={props.placeholder}
                    searchPlaceholder="Search..."
                    value={props.value}
                    disable={props.indicator}
                    dropdownPosition={props.dropdownPosition || 'auto'}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={item => {
                        props.setValue(item);
                        setFocus(false);
                    }}
                    renderLeftIcon={() => {
                        return (
                            <Icon
                                style={{ marginHorizontal: wp(2) - 3 }}
                                name={props.leftIconName}
                                type={props.rightIconName ? props.rightIconName : 'material'}
                                color={focus ? colors.primary : (props.leftIconColor ? props.leftIconColor : colors.secondary)}
                                size={20}
                            />
                        )
                    }}
                    renderRightIcon={() => {
                        return (
                            props.indicator ?
                            <ActivityIndicator style={{ marginHorizontal: wp(2) - 3 }} size={20} color={colors.secondary}/> :
                            <Icon
                                style={{ marginHorizontal: wp(2) - 3 }}
                                name={'expand-more'}
                                type={'material'}
                                color={focus ? colors.primary : (props.leftIconColor ? props.leftIconColor : colors.secondary)}
                                size={25}
                            />
                        )
                    }}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

export default DropDown

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: 5,
        elevation: 3,
        shadowOffset: { width: 2, height: 3 },
        shadowColor: '#171717',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderWidth: 0.5,
        padding: wp(2) - 3
    },
    heading: {
        color: colors.secondary,
        fontFamily: fonts.semiBold,
        marginLeft: 15,
        fontSize: fontSize.m
    },
    placeholderStyle: {
        fontSize: fontSize.s,
        color: colors.placeHolder
    },
    selectedTextStyle: {
        fontSize: fontSize.s,
        color: colors.secondary,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: fontSize.s,
        color: colors.secondary,
    },
    item: {
        padding: wp(3),
        paddingHorizontal: wp(5),
    },
    textItem: {
        flex: 1,
        fontSize: fontSize.s,
        color: colors.secondary
    },
});