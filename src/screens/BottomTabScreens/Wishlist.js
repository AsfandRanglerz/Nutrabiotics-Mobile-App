import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../../constants/Constants'
import Header from '../../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import ProFlalistVertical from '../../components/ProFlalistVertical'
import { useSelector } from 'react-redux'

const Wishlist = () => {

  const wishlistData = useSelector(state => state.WishlistReducer)

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg)
    }
    StatusBar.setBarStyle('dark-content')
  })

  return (
    <SafeAreaView style={styles.container} >
      <Header heading={'Wishlist'} hideBackButton={true} />
      <ProFlalistVertical data={wishlistData} />
    </SafeAreaView>
  )
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center'
  }
})