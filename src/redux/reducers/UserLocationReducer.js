import ActionTypes from '../ActionTypes';

const initialState = null;
const UserLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.user_location:
      return action.payload;
    default:
      return state;
  }
};

export default UserLocationReducer;
