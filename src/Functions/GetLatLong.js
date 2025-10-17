// // utils/getCountryLatLng.js

// export const getCountryLatLng = async countryName => {
//   try {
//     if (!countryName) return null;

//     const res = await fetch(
//       `https://restcountries.com/v3.1/name/${countryName}?fullText=false`,
//     );
//     const data = await res.json();

//     if (!Array.isArray(data) || data.length === 0) {
//       return null;
//     }

//     // Extract country info
//     const country = data[0];
//     const lat = country.latlng?.[0] || null;
//     const lng = country.latlng?.[1] || null;

//     if (!lat || !lng) {
//       return null;
//     }

//     return {
//       name: country.name.common,
//       latitude: lat,
//       longitude: lng,
//     };
//   } catch (error) {
//     console.log('getCountryLatLng Error:', error);
//     return null;
//   }
// };
