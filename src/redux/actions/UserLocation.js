import ActionTypes from '../ActionTypes';

const userLocation = data => ({
  type: ActionTypes.user_location,
  payload: data,
});
export { userLocation };
