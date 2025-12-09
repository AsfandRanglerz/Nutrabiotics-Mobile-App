// import React, { useEffect, useState } from 'react';
// import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
// import { useIsFocused, useRoute } from '@react-navigation/native';
// import { colors } from '../../constants/Constants';
// import Header from '../../components/Header';
// import ProFlalistVertical from '../../components/ProFlalistVertical';
// import { productRequests } from '../../constants/Api';
// import { useSelector } from 'react-redux';

// const AllProducts = () => {
//   const params = useRoute().params;
//   const isFocused = useIsFocused();
//   const wishlistData = useSelector(state => state.WishlistReducer);

//   const [indicator, setIndicator] = useState(true);
//   const [data, setData] = useState(params?.data ? [...params.data] : []);

//   console.log('@PARAM', params);

//   // ✅ StatusBar setup
//   useEffect(() => {
//     if (Platform.OS === 'android') StatusBar.setBackgroundColor(colors.bg);
//     StatusBar.setBarStyle('dark-content');
//   }, []);

//   // ✅ API request
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIndicator(true);
//         const formData = new FormData();

//         if (params?.heading === 'Popular') {
//           if (params?.location) {
//             formData.append('latitude', params.location.latitude);
//             formData.append('longitude', params.location.longitude);
//           }
//           formData.append('country', params?.country);

//           const res = await productRequests.populars(formData);
//           if (res?.status === 200) {
//             const arr = res?.data?.availableProducts?.map(item => {
//               const product = item?.product?.product;
//               return {
//                 ...product,
//                 fav: wishlistData?.some(it => it.id === product.id),
//               };
//             });
//             setData(arr);
//           }
//         } else {
//           formData.append('subcategory_id', params?.id);
//           formData.append('country', params?.country);

//           // ✅ Sirf tab add karo jab location present hai
//           if (params?.location?.latitude && params?.location?.longitude) {
//             formData.append('latitude', params.location.latitude);
//             formData.append('longitude', params.location.longitude);
//           }

//           // ✅ Debug log clearly show karega ke field gayi ya nahi
//           console.log('🚀 Final FormData send ho rahi hai:', {
//             subcategory_id: params?.id,
//             country: params?.country,
//             ...(params?.location?.latitude && params?.location?.longitude
//               ? {
//                   latitude: params.location.latitude,
//                   longitude: params.location.longitude,
//                 }
//               : {}),
//           });

//           const res = await productRequests.allProducts(formData);
//           console.log('@@@@resss', res?.data);
//           let allProducts = [];
//           if (res?.data?.pharmaciesWithProducts?.length) {
//             res.data.pharmaciesWithProducts.forEach(pharmacy => {
//               pharmacy?.products?.forEach(product => allProducts.push(product));
//             });
//           }

//           if (res?.status === 200) {
//             const arr = allProducts.map(item => ({
//               ...item,
//               fav: wishlistData?.some(it => it.id === item.id),
//             }));
//             setData(arr);
//           }
//         }
//       } catch (err) {
//         console.log('API Error:', err);
//       } finally {
//         setIndicator(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // ✅ Update wishlist favs on focus
//   useEffect(() => {
//     if (isFocused && data.length > 0) {
//       const updated = data.map(item => ({
//         ...item,
//         fav: wishlistData?.some(it => it.id === item.id),
//       }));
//       setData(updated);
//     }
//   }, [isFocused]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header heading={params?.heading} />
//       <ProFlalistVertical indicator={indicator} data={data} />
//     </SafeAreaView>
//   );
// };

// export default AllProducts;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.bg,
//     alignItems: 'center',
//   },
// });

import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { colors } from '../../constants/Constants';
import Header from '../../components/Header';
import ProFlalistVertical from '../../components/ProFlalistVertical';
import { productRequests } from '../../constants/Api';
import { useSelector } from 'react-redux';

const AllProducts = () => {
  const params = useRoute().params;
  const isFocused = useIsFocused();
  const wishlistData = useSelector(state => state.WishlistReducer);

  const [indicator, setIndicator] = useState(true);
  const [data, setData] = useState(params?.data ? [...params.data] : []);
  // const [data, setData] = useState([]);

  // ✅ StatusBar setup
  useEffect(() => {
    if (Platform.OS === 'android') StatusBar.setBackgroundColor(colors.bg);
    StatusBar.setBarStyle('dark-content');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIndicator(true); // ← LOADER START HERE
        const formData = new FormData();

        // POPULAR PRODUCTS
        if (params?.heading === 'Popular') {
          if (params?.location) {
            formData.append('latitude', params.location.latitude);
            formData.append('longitude', params.location.longitude);
          }
          formData.append('country', params?.country);

          const res = await productRequests.populars(formData);
          if (res?.status === 200) {
            const arr = res?.data?.availableProducts?.map(item => {
              const product = item?.product?.product;
              return {
                ...product,
                fav: wishlistData?.some(it => it.id === product.id),
              };
            });
            setData(arr);
          }
          return;
        }

        // OTHER PRODUCTS
        formData.append('subcategory_id', params?.id);
        formData.append('country', params?.country);

        if (params?.location?.latitude && params?.location?.longitude) {
          formData.append('latitude', params.location.latitude);
          formData.append('longitude', params.location.longitude);
        }

        const res = await productRequests.allProducts(formData);

        let allProducts = [];

        if (res?.data?.products?.length) {
          allProducts = res.data.products;
        } else if (res?.data?.pharmaciesWithProducts?.length) {
          res.data.pharmaciesWithProducts.forEach(pharmacy => {
            pharmacy?.products?.forEach(product => allProducts.push(product));
          });
        }

        if (res?.status === 200) {
          const arr = allProducts.map(item => ({
            ...item,
            fav: wishlistData?.some(it => it.id === item.id),
          }));
          setData(arr);
        }
      } catch (err) {
        console.log('API Error:', err);
      } finally {
        setIndicator(false); // ← LOADER STOP HERE
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header heading={params?.heading} />
      <ProFlalistVertical indicator={indicator} data={data} />
    </SafeAreaView>
  );
};

export default AllProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
  },
});
