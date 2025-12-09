import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { colors, wp } from '../constants/Constants';

let count = 0;
let interval;

const Slider = props => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const arrayLength = props.data?.length || 0;
  const width = wp(100);
  const navigation = useNavigation();

  const startInterval = () => {
    if (!props.disableAutoScroll) {
      interval = setInterval(() => {
        if (count < arrayLength - 1) {
          props.scrollRef?.current?.scrollTo({ x: width * (count + 1) });
        } else {
          props.scrollRef?.current?.scrollTo({ x: 0, animated: false });
        }
      }, 5000);
    }
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.bannerContainer, props.mainContainerStyle]}>
      <ScrollView
        onScrollBeginDrag={() => {
          clearInterval(interval);
        }}
        onScrollEndDrag={() => {
          startInterval();
        }}
        ref={props.scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={e => {
          const xOffset = e.nativeEvent.contentOffset.x;
          const index = Math.round(xOffset / width);
          count = index;
          if (index != focusedIndex) setFocusedIndex(index);
        }}
      >
        {props.data?.map((item, index) => {
          return (
            <Pressable
              onPress={() => {
                index == 0 && navigation.navigate('HowToOrder');
              }}
              key={item?.id}
              style={[
                styles.bannerImage,
                props.imageStyle?.height
                  ? { height: props.imageStyle?.height }
                  : null,
                styles.center,
              ]}
            >
              <Image
                source={{ uri: item?.photo || item?.image }}
                style={[styles.bannerImage, props.imageStyle]}
                resizeMode={
                  props.imageResizeMode ? props.imageResizeMode : 'contain'
                }
              />
            </Pressable>
          );
        })}
      </ScrollView>
      <View
        style={{ flexDirection: 'row', ...styles.center, paddingVertical: 10 }}
      >
        {props.data?.length > 1 ? (
          props.data?.map((item, index) => {
            return (
              <View
                key={item?.id}
                style={[
                  focusedIndex == index
                    ? { ...styles.activeDot, ...props.activeDotStyle }
                    : { ...styles.dot, ...props.dotStyle },
                ]}
              />
            );
          })
        ) : (
          <View style={{ height: wp(3) }} />
        )}
      </View>
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  bannerImage: {
    height: wp(40),
    width: wp(90),
    borderRadius: 10,
    marginHorizontal: wp(5),
  },
  bannerContainer: {
    width: wp(100),
  },
  dot: {
    height: wp(2),
    width: wp(2),
    borderRadius: wp(1),
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 5,
  },
  activeDot: {
    height: wp(3),
    width: wp(3),
    borderRadius: wp(1.5),
    marginHorizontal: 5,
    backgroundColor: colors.primary,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
