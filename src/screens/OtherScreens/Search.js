import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, fonts, fontSize, hp, indicatorSize, wp } from '../../constants/Constants'
import InputField from '../../components/InputField'
import { useNavigation } from '@react-navigation/native'
import ProFlalistVertical from '../../components/ProFlalistVertical'
import { productRequests } from '../../constants/Api'
import { useSelector } from 'react-redux'

const Search = () => {

  const [search, setSearch] = useState()
  const [data, setData] = useState([])
  const [indicator, setIndicator] = useState(false)
  const wishlistData = useSelector(state => state.WishlistReducer)

  const getData = () => {
    if(!search){
      return true
    }
    setIndicator(true)
    setData([])
    productRequests.productSearch(search)
      .then((res) => {
        if (res.status == 200) {
          const arr = res?.data?.map((item) => {
            if (wishlistData?.find((it) => it.id == item.id)) {
              item.fav = true;
            } else {
              item.fav = false
            }
            return { ...item }
          })
          setData(arr || [])
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIndicator(false))
  }

  return (
    <SafeAreaView style={[styles.container]} >
      <InputField
        autoFocus
        value={search}
        setValue={setSearch}
        placeholder={'Search'}
        leftIconName={'search'}
        leftIconType={'material'}
        leftIconColor={colors.grey}
        inputContainerStyle={{ borderRadius: 20, width: wp(90) }}
        mainContainerStyle={{ width: wp(100), backgroundColor: colors.bg, paddingVertical: 10, ...styles.center }}
        onSubmitEditing={getData}
        search
        indicator={indicator}
      />
      <ProFlalistVertical data={data} indicator={indicator} />
    </SafeAreaView>
  )
}

export default Search

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
  header: {
    flexDirection: 'row',
    width: wp(90),
    alignItems: 'center',
    paddingVertical: 10
  },
  notificationCont: {
    height: wp(10),
    aspectRatio: 1,
    borderRadius: wp(5),
    backgroundColor: colors.white,
    elevation: 5,
    shadowOffset: { width: 2, height: 3 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -5 }]
  },
  locationTxt: {
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
    color: colors.secondary
  },
  nameTxt: {
    fontFamily: fonts.bold,
    fontSize: fontSize.l,
    color: colors.secondary
  },
  heading: {
    color: colors.secondary,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    flex: 1
  },
  viewAll: {
    color: colors.primary,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
  }
})