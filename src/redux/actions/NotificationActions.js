import { productRequests } from '../../constants/Api';
import ActionTypes from '../ActionTypes';

const getAllNotifications = id => dispatch => {
  const formData = new FormData();
  formData.append('user_id', id);
  productRequests
    .notifications(formData)
    .then(res => {
      if (res.status == 200) {
        const data =
          res?.data?.successData?.notification?.map(item => {
            let date = new Date(item?.created_at);
            date = `${date.getDate()}-${
              date.getMonth() + 1
            }-${date.getFullYear()}`;
            const sendItem = JSON.parse(item?.body);
            const body = item?.body ? JSON.parse(item?.body) : {};
            const product = body.products?.[0] || {}; // get first product if exists
            return {
              id: item?.id,
              date,
              couponCode: sendItem?.code,
              title: item?.title,
              productId: product?.product_id,
              pharmacyName: sendItem?.pharmacy_name,
              productName: product?.product_name,
              productDiscountPer: product?.d_per,
              productDiscountPrice: product?.d_price,
              productPrice: product?.price,
              seen: item?.seen == 1,
              orderId: sendItem?.order_id,
              description: body,
            };
          }) || [];

        dispatch({
          type: ActionTypes.get_all_notifications,
          payload: data,
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
const addNewNotification = data => {
  return {
    type: ActionTypes.add_new_notification,
    payload: data,
  };
};
const notificationSeen = id => dispatch => {
  productRequests
    .notificationSeen(id)
    .then(res => console.log('@resss', res))
    .catch(err => console.log('@@@', err));
  dispatch({
    type: ActionTypes.notification_seen,
    payload: id,
  });
};

export { getAllNotifications, addNewNotification, notificationSeen };
