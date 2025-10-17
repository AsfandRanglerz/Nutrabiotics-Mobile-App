import {productRequests} from '../../constants/Api';
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
            const body = item?.body ? JSON.parse(item?.body) : {};
            return {
              id: item?.id,
              date,
              title: item?.title,
              productId: body?.product_id,
              productName: body?.product_name,
              productDiscountPer: body?.d_per,
              productDiscountPrice: body?.d_price,
              productPrice: body?.price,
              seen: item?.seen == 1 ? true : false,
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
    .then(res => {})
    .catch(err => console.log(err));
  dispatch({
    type: ActionTypes.notification_seen,
    payload: id,
  });
};

export {getAllNotifications, addNewNotification, notificationSeen};
