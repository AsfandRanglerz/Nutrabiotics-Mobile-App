import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/themed'
import { colors, fonts, fontSize, wp } from '../constants/Constants'
import { useNavigation } from '@react-navigation/native'

const Header = (props) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container} >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.sideCont} >
        {props.hideBackButton ? null :
          <Icon
            type='material'
            name={'arrow-back'}
            color={colors.secondary}
          />
        }
      </TouchableOpacity>
      <View style={{ flex: 1, ...styles.center }} >
        {props.heading &&
          <Text style={styles.heading} >{props.heading}</Text>
        }
      </View>
      <View style={[styles.sideCont, { alignItems: 'flex-end' }]} >
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sideCont: {
    width: 40,
    alignItems: 'flex-start'
  },
  heading: {
    color: colors.secondary,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m
  }
})