import {StatusBar} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const colors = {
  primary: '#ed7521',
  secondary: '#434343',
  placeHolder: '#c8c7c7',
  bg: '#fafafa',
  blue: '#00308f',
  white: 'white',
  black: 'black',
  lightGrey: '#f1f1f1',
  grey: '#c5c5c5',
  darkGrey: '#787878',
  black: 'black',
  openedNotificationBackgroundColor: 'rgba(70,70,70,0.1)',
  notificationBackgroundColor: 'rgba(237, 117, 33,0.1)',
  error: '#cc0d0d',
  success: '#008000',
};
const fonts = {
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semiBold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
};
const fontSize = {
  xxs: 8,
  xs: 10,
  s: 12,
  m: 15,
  mToL: 18,
  l: 20,
  xl: 25,
  xxl: 30,
};
const hp = e => {
  const StatusBarHeight = StatusBar.currentHeight;
  return heightPercentageToDP(e) - StatusBarHeight;
};
const wp = widthPercentageToDP;

const regex = {
  // email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};
const indicatorSize = {
  s: wp(5),
  m: wp(8),
  l: wp(10),
};

const homeSubCatData = [
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
  {name: 'Vitamin', path: require('../assets/icons/subCatIcon.png')},
];

const proData = [
  {
    id: 8,
    product_name: 'Melinda Clayton',
    category_id: '5',
    subcategory_id: '15',
    price: '230',
    fav: false,
    stock: '2345',
    description: 'Eos id eu consequa',
    status: '0',
    created_at: '2023-03-07T20:07:24.000000Z',
    updated_at: '2023-03-22T08:11:21.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679491156.jpg',
      },
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679490714.jpg',
      },
    ],
  },
  {
    id: 10,
    product_name: 'Deanna Parker',
    category_id: '5',
    subcategory_id: '15',
    price: '831',
    fav: false,
    stock: '24',
    description: 'Aspernatur quis et v',
    status: '0',
    created_at: '2023-03-13T01:30:04.000000Z',
    updated_at: '2023-03-13T01:30:04.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679489372.jpg',
      },
    ],
  },
  {
    id: 11,
    product_name: 'Jonah Becker',
    category_id: '5',
    subcategory_id: '15',
    price: '649',
    fav: false,
    stock: '51',
    description: 'Repellendus Labore',
    status: '0',
    created_at: '2023-03-16T12:44:05.000000Z',
    updated_at: '2023-03-16T12:44:05.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679491135.jpg',
      },
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679490472.jpg',
      },
    ],
  },
  {
    id: 8,
    product_name: 'Melinda Clayton',
    category_id: '5',
    subcategory_id: '15',
    price: '230',
    fav: false,
    stock: '2345',
    description: 'Eos id eu consequa',
    status: '0',
    created_at: '2023-03-07T20:07:24.000000Z',
    updated_at: '2023-03-22T08:11:21.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679491156.jpg',
      },
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679490714.jpg',
      },
    ],
  },
  {
    id: 10,
    product_name: 'Deanna Parker',
    category_id: '5',
    subcategory_id: '15',
    price: '831',
    fav: false,
    stock: '24',
    description: 'Aspernatur quis et v',
    status: '0',
    created_at: '2023-03-13T01:30:04.000000Z',
    updated_at: '2023-03-13T01:30:04.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679489372.jpg',
      },
    ],
  },
  {
    id: 11,
    product_name: 'Jonah Becker',
    category_id: '5',
    subcategory_id: '15',
    price: '649',
    fav: false,
    stock: '51',
    description: 'Repellendus Labore',
    status: '0',
    created_at: '2023-03-16T12:44:05.000000Z',
    updated_at: '2023-03-16T12:44:05.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679491135.jpg',
      },
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679490472.jpg',
      },
    ],
  },
];
const favProData = [
  {
    id: 8,
    product_name: 'Melinda Clayton',
    category_id: '5',
    subcategory_id: '15',
    price: '230',
    fav: true,
    stock: '2345',
    description: 'Eos id eu consequa',
    status: '0',
    created_at: '2023-03-07T20:07:24.000000Z',
    updated_at: '2023-03-22T08:11:21.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679491156.jpg',
      },
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679490714.jpg',
      },
    ],
  },
  {
    id: 10,
    product_name: 'Deanna Parker',
    category_id: '5',
    subcategory_id: '15',
    price: '831',
    fav: true,
    stock: '24',
    description: 'Aspernatur quis et v',
    status: '0',
    created_at: '2023-03-13T01:30:04.000000Z',
    updated_at: '2023-03-13T01:30:04.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679489372.jpg',
      },
    ],
  },
  {
    id: 11,
    product_name: 'Jonah Becker',
    category_id: '5',
    subcategory_id: '15',
    price: '649',
    fav: true,
    stock: '51',
    description: 'Repellendus Labore',
    status: '0',
    created_at: '2023-03-16T12:44:05.000000Z',
    updated_at: '2023-03-16T12:44:05.000000Z',
    photos: [
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679491135.jpg',
      },
      {
        photo:
          'https://ranglerzwp.xyz/nutrabiotics/public/admin/assets/img/users/1679490472.jpg',
      },
    ],
  },
];
const categoriesData = [
  {name: 'Health'},
  {name: 'Beauty'},
  {name: 'Medical'},
  {name: 'Nutrition'},
  {name: 'Health'},
  {name: 'Beauty'},
  {name: 'Medical'},
  {name: 'Nutrition'},
  {name: 'Health'},
  {name: 'Beauty'},
  {name: 'Medical'},
  {name: 'Nutrition'},
  {name: 'Health'},
];
const NotificationsData = [
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: false,
  },
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: true,
  },
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: true,
  },
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: true,
  },
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: true,
  },
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: true,
  },
  {
    image: require('../assets/images/banner1.jpeg'),
    time: 'Today 11:23 am',
    title: 'Your order is confirmed',
    opened: true,
  },
];
const CoupensData = [
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
  {itemName: 'Gold standard whey protein', coupenCode: '1234'},
];
const pharmaciesData = [
  {
    pharmacyId: 1,
    name: 'Abc pharmacy',
    location: 'abc, xyz road, Lahore, Pakistan.',
  },
  {
    pharmacyId: 2,
    name: 'Abc pharmacy',
    location: 'abc, xyz road, Lahore, Pakistan.',
  },
  {
    pharmacyId: 3,
    name: 'Abc pharmacy',
    location: 'abc, xyz road, Lahore, Pakistan.',
  },
];

export {
  colors,
  fonts,
  fontSize,
  wp,
  hp,
  regex,
  indicatorSize,
  homeSubCatData,
  proData,
  categoriesData,
  favProData,
  NotificationsData,
  CoupensData,
  pharmaciesData,
};
