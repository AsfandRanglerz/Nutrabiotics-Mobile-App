import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, wp } from '../../constants/Constants';
import Header from '../../components/Header';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ProFlalistVertical from '../../components/ProFlalistVertical';
import { productRequests } from '../../constants/Api';

const Deals = () => {
  const [data, setData] = useState([]);
  const wishlistData = useSelector(state => state.WishlistReducer);
  const [indicator, setIndicator] = useState(true);
  const isFocused = useIsFocused();
  const location = useSelector(state => state?.UserLocationReducer);

  useFocusEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(colors.bg);
    }
    StatusBar.setBarStyle('dark-content');
  });

  const getData = () => {
    const formData = new FormData();

    if (location?.latitude && location?.longitude) {
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
    }

    if (location?.country) {
      formData.append('country', location.country);
    }

    productRequests
      .deals(formData)
      .then(res => {
        let allProducts = [];

        // 🟢 Case 1: If response contains pharmacies with products
        if (res?.data?.pharmaciesWithProducts?.length > 0) {
          res.data.pharmaciesWithProducts.forEach(pharmacy => {
            pharmacy?.products?.forEach(product => {
              allProducts.push(product);
            });
          });
        }

        // 🟢 Case 2: If response directly contains products
        else if (res?.data?.products?.length > 0) {
          allProducts = res.data.products;
        }

        if (res.status === 200 && allProducts.length > 0) {
          const arr = allProducts.map(item => ({
            ...item,
            fav: !!wishlistData?.find(it => it.id === item.id),
          }));

          arr.sort(
            (a, b) =>
              b?.product_details?.[0]?.d_per - a?.product_details?.[0]?.d_per,
          );

          setData(arr);
        } else {
          setData([]); // empty if no products
        }
      })
      .catch(err => console.log(err))
      .finally(() => setIndicator(false));
  };

  useEffect(() => {
    getData();
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && data.length > 0) {
      const products = data.map(item => {
        if (wishlistData?.find(it => it.id == item.id)) {
          item.fav = true;
        } else {
          item.fav = false;
        }
        return { ...item };
      });
      setData(products);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <Header heading={'Deals'} hideBackButton={true} />
      <ProFlalistVertical data={data} indicator={indicator} />
    </SafeAreaView>
  );
};

export default Deals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
});
