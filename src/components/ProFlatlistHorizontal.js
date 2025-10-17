import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { colors, fonts, fontSize, wp } from '../constants/Constants';
import ProductContainer from './ProductContainer';

const ProFlatlistHorizontal = props => {
  const hasData = props?.data && props.data.length > 0;

  return (
    <View style={{ width: wp(100), ...styles.center }}>
      <View style={{ flexDirection: 'row', width: wp(90), marginVertical: 10 }}>
        <Text style={styles.heading}>{props.heading}</Text>
        <TouchableOpacity onPress={props.onViewAllPress}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {hasData ? (
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={props.data}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: wp(2),
            paddingLeft: wp(5),
            paddingRight: wp(3),
          }}
          renderItem={({ item, index }) => (
            <ProductContainer item={item} index={index} />
          )}
        />
      ) : (
        <View style={{ paddingVertical: wp(5) }}>
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      )}
    </View>
  );
};

export default ProFlatlistHorizontal;

const styles = StyleSheet.create({
  heading: {
    color: colors.secondary,
    fontFamily: fonts.semiBold,
    fontSize: fontSize.m,
    flex: 1,
  },
  viewAll: {
    color: colors.primary,
    fontFamily: fonts.regular,
    fontSize: fontSize.s,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: colors.gray,
    fontFamily: fonts.medium,
    fontSize: fontSize.s,
    textAlign: 'center',
  },
});
