import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import ProductContainer from './ProductContainer';
import {
  colors,
  fonts,
  fontSize,
  hp,
  indicatorSize,
  wp,
} from '../constants/Constants';

const ProFlalistVertical = props => {
  return props.data?.length > 0 ? (
    <FlatList
      scrollEnabled={props.disableScroll ? false : true}
      keyExtractor={(item, index) => index?.toString()}
      data={props.data}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        width: wp(90),
        padding: 3,
        paddingBottom: hp(20),
      }}
      ListHeaderComponentStyle={{ height: 10 }}
      ListHeaderComponent={<View />}
      renderItem={({ item, index }) => {
        return (
          <ProductContainer
            key={item?.id}
            item={item}
            index={index}
            containerStyle={{
              marginRight: wp(4) - 6,
              marginBottom: wp(4) - 6,
              width: wp(43),
            }}
          />
        );
      }}
    />
  ) : (
    <View style={{ flex: 1, ...styles.center }}>
      {props?.indicator ? (
        <ActivityIndicator size={indicatorSize.m} color={colors.primary} />
      ) : (
        <Text style={styles.txt}>No Data Found</Text>
      )}
    </View>
  );
};

export default ProFlalistVertical;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: fonts.medium,
    fontSize: fontSize.s,
    color: colors.darkGrey,
  },
});
