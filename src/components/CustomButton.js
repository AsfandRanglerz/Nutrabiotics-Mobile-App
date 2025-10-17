import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { colors, fonts, fontSize, wp } from '../constants/Constants'

const CustomButton = (props) => {
  return (
    <TouchableOpacity
      disabled={props.indicator}
      onPress={props.onPress}
      style={[
        styles.button,
        { backgroundColor: props.buttonColor ? props.buttonColor : colors.primary, width: props.width ? props.width : wp(90) },
        props.containerStyle ? { ...props.containerStyle } : null,
      ]}
    >
      { props.indicator ? 
      <ActivityIndicator size={20} color={colors.white} /> : 
      <Text style={[styles.btnTxt, { color: props.buttonTextColor ? props.buttonTextColor : colors.white }]} >{props.buttonText}</Text>
}
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 20
  },
  btnTxt: {
    fontFamily: fonts.medium,
    fontSize: fontSize.m
  }
})