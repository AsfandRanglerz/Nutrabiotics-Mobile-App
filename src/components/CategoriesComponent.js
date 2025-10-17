import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  colors,
  fonts,
  fontSize,
  homeSubCatData,
  wp,
} from '../constants/Constants';
import { useNavigation } from '@react-navigation/native';

const CategoriesComponent = props => {
  const navigation = useNavigation();
  // const location = props?.location?.location
  //   ? props?.location?.location
  //   : props?.location;

  const location = props?.location;

  const country = props?.country;
  return (
    <View style={styles.mainContainer}>
      {props.data.map((item, index) => {
        return (
          <TouchableOpacity
            key={item?.id}
            onPress={() =>
              navigation.navigate('AllProducts', {
                heading: item?.name,
                id: item?.id,
                location: location,
                country: country,
              })
            }
            style={[
              styles.singleCat,
              { marginRight: (index + 1) % 4 ? wp(1) : 0 },
            ]}
          >
            <Image
              resizeMode="contain"
              source={
                item?.image
                  ? { uri: item?.image }
                  : require('../assets/icons/subCatIcon.png')
              }
              style={styles.image}
            />
            <Text numberOfLines={1} style={styles.txt} ellipsizeMode="tail">
              {item?.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategoriesComponent;

const styles = StyleSheet.create({
  mainContainer: {
    width: wp(90),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleCat: {
    width: wp(21),
    height: wp(21),
    marginBottom: wp(1),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  image: {
    height: wp(11),
    width: wp(11),
    borderRadius: 7,
  },
  txt: {
    fontFamily: fonts.regular,
    fontSize: fontSize.xxs,
    color: colors.secondary,
    marginTop: wp(2),
    width: wp(18),
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
