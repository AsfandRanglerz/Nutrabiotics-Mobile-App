import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, fonts, fontSize, wp } from '../constants/Constants';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlist,
  removeFromWishlist,
} from '../redux/actions/WishlistActions';

const ProductContainer = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [fav, setFav] = useState(false);
  const discountPercent = Number(props.item?.product_details?.[0]?.d_per) || 0;
  const wishlistData = useSelector(state => state.WishlistReducer);

  useEffect(() => {
    if (!props?.item) return; // <-- Prevent invalid renders
    const isFav = wishlistData?.some(it => it.id === props.item.id);
    setFav(isFav);
  }, [wishlistData, props?.item]);
  const favourite = () => {
    if (fav) {
      setFav(false);
      dispatch(removeFromWishlist(props.item));
    } else {
      setFav(true);
      dispatch(addToWishlist(props.item));
    }
  };
  // useEffect(() => {
  //   setFav(props.item.fav);
  // }, [props?.item]);

  return (
    <Pressable
      onPress={() => navigation.navigate('ProDetail', { id: props?.item?.id })}
      style={[styles.container, { ...props.containerStyle }]}
    >
      {/* Off Container */}
      {discountPercent > 0 ? (
        <View style={styles.offCont}>
          <Text style={styles.offTxt} numberOfLines={1}>
            {discountPercent}%
          </Text>
          <Text style={styles.offTxt}>Off</Text>
        </View>
      ) : null}
      {/* Favourite Container */}
      <TouchableOpacity
        onPress={favourite}
        style={[
          styles.favCont,
          { borderColor: fav ? colors.primary : colors.grey },
        ]}
      >
        <Icon
          type={'material'}
          name={'favorite'}
          color={fav ? colors.primary : colors.grey}
          size={wp(3)}
        />
      </TouchableOpacity>
      <Image
        source={
          props.item?.photos && props.item?.photos[0]?.photo
            ? { uri: props.item?.photos[0]?.photo }
            : require('../assets/images/default-image-white.png')
        }
        style={styles.image}
        resizeMode={'contain'}
      />
      <Text style={styles.title} numberOfLines={2}>
        {props.item?.product_name}
      </Text>
      <View style={styles.productPrice}>
        <Text
          numberOfLines={1}
          style={[
            styles.price,
            discountPercent > 0
              ? {
                  textDecorationLine: 'line-through',
                  color: colors.darkGrey,
                }
              : null,
          ]}
        >
          {props?.item?.product_details &&
            props?.item?.product_details[0]?.currency}{' '}
          {Number(
            props?.item?.product_details &&
              props?.item?.product_details[0]?.price,
          )
            .toFixed(2)
            .replace(/.00$/, '')}
        </Text>
        {discountPercent > 0 ? (
          <Text numberOfLines={1} style={[styles.price, { marginLeft: 5 }]}>
            {Number(
              props?.item?.product_details &&
                props?.item?.product_details[0]?.d_price,
            )
              .toFixed(2)
              .replace(/.00$/, '')}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProDetail', { id: props?.item?.id })
        }
        style={styles.detailBtn}
      >
        <Text style={styles.btnTxt}>See Details</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default ProductContainer;

const styles = StyleSheet.create({
  container: {
    width: wp(40),
    borderWidth: 0.5,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    padding: wp(2),
    backgroundColor: colors.white,
    elevation: 2,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginRight: wp(2),
  },
  offCont: {
    backgroundColor: colors.blue,
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopLeftRadius: 10,
    padding: wp(1),
  },
  offTxt: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    flex: 1,
  },
  favCont: {
    position: 'absolute',
    top: wp(1.5),
    right: wp(1.5),
    height: wp(5),
    width: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 1,
    borderColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: wp(20),
    width: wp(20),
    alignSelf: 'center',
    marginVertical: wp(3),
  },
  title: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    flex: 1,
  },
  price: {
    color: colors.primary,
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
    marginTop: wp(1),
  },
  detailBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: wp(1),
    alignSelf: 'flex-start',
    padding: wp(1),
    paddingHorizontal: wp(2),
  },
  btnTxt: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: fontSize.xs,
  },
  productPrice: {
    marginTop: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
});
