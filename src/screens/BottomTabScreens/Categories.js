import {
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  categoriesData,
  colors,
  fonts,
  fontSize,
  homeSubCatData,
  hp,
  indicatorSize,
  wp,
} from '../../constants/Constants';
import { Icon } from '@rneui/themed';
import CategoriesComponent from '../../components/CategoriesComponent';
import Header from '../../components/Header';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import { productRequests } from '../../constants/Api';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

const Categories = () => {
  const route = useRoute();
  const reduxLocation = useSelector(state => state?.UserLocationReducer);

  const location = route?.params?.location || reduxLocation;
  const country = route?.params?.country || reduxLocation?.country;
  const [renderArrow, setRenderArrow] = useState(true);
  const [catIndicator, setCatIndicator] = useState(true);
  const [subCatIndicator, setSubCatIndicator] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const scrollRef = useRef();
  console.log('@LOCATION ', location);
  console.log('@Country ', country);

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });
  const getCategories = () => {
    setCatIndicator(true);
    productRequests
      .category()
      .then(res => {
        if (res?.status == 200) {
          console.log('@res in Category', res?.data);
          const data = res?.data?.successData?.data?.map(item => {
            return { id: item.id, name: item.name };
          });
          setCategories(data || []);
          if (data && data?.length > 0) {
            getSubCategories(data[0].id);
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setCatIndicator(false));
  };
  const getSubCategories = id => {
    if (id == selectedCatId) return true;
    setSelectedCatId(id);
    setSubCatIndicator(true);
    console.log('@IDDD', id);
    productRequests
      .subCategory(id)
      .then(res => {
        if (res?.status == 200) {
          console.log('@SUb', res?.data);
          const data = res?.data?.successData?.data?.map(item => {
            return {
              id: item.id,
              name: item.name,
              image: item.image,
              category_id: item.category_id,
            };
          });
          setSubCategories(data || []);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setSubCatIndicator(false));
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <SafeAreaView style={[styles.container, styles.center]}>
      <ScrollView
        contentContainerStyle={[
          { paddingBottom: wp(25), flexGrow: 1, alignItems: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Header heading={'Categories'} hideBackButton={true} />
        {categories?.length == 0 && catIndicator ? (
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size={indicatorSize.m} color={colors.primary} />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FlatList
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categories}
                keyExtractor={item => item?.id}
                onScroll={e => {
                  if (
                    e.nativeEvent.contentSize.width >
                    e.nativeEvent.contentOffset.x + wp(100) + 10
                  ) {
                    setRenderArrow(true);
                  } else {
                    setRenderArrow(false);
                  }
                }}
                contentContainerStyle={styles.catContainer}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => getSubCategories(item.id)}
                      style={[
                        styles.singleCatCont,
                        {
                          backgroundColor:
                            item.id == selectedCatId
                              ? 'rgba(70,70,70,0.1)'
                              : 'transparent',
                        },
                      ]}
                    >
                      <Text style={styles.catTxt}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              {renderArrow ? (
                <Animated.View
                  entering={FadeIn.duration(100)}
                  exiting={FadeOut.duration(100)}
                  style={styles.arrowCont}
                >
                  <Icon
                    type={'material'}
                    name={'chevron-right'}
                    color={colors.secondary}
                    onPress={() =>
                      scrollRef.current?.scrollToEnd({ animated: true })
                    }
                  />
                </Animated.View>
              ) : null}
            </View>
            {subCatIndicator ? (
              <ActivityIndicator
                style={{ marginTop: wp(10) }}
                size={indicatorSize.m}
                color={colors.primary}
              />
            ) : subCategories?.length == 0 ? (
              <Text style={styles.noDataTxt}>No data Found</Text>
            ) : (
              <CategoriesComponent
                data={subCategories}
                location={location}
                country={country}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  catContainer: {
    flexDirection: 'row',
    paddingLeft: wp(5),
    paddingRight: 0,
    marginVertical: 15,
  },
  singleCatCont: {
    marginRight: wp(3),
    borderRadius: 20,
  },
  catTxt: {
    color: colors.secondary,
    fontSize: fontSize.s,
    fontFamily: fonts.medium,
    padding: wp(2),
    paddingVertical: wp(1),
  },
  noDataTxt: {
    color: colors.darkGrey,
    fontSize: fontSize.s,
    fontFamily: fonts.regular,
    marginTop: wp(10),
  },
  arrowCont: {
    position: 'absolute',
    right: 0,
    backgroundColor: colors.bg,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
});
