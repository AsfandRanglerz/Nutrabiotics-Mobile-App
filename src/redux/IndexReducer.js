import UserReducer from './reducers/UserReducer';
import WishlistReducer from './reducers/WishlistReducer';
import NotificationReducer from './reducers/NotificationReducer';

import {combineReducers} from 'redux';
import UserLocationReducer from './reducers/UserLocationReducer';

const indexReducer = combineReducers({
  UserReducer,
  WishlistReducer,
  NotificationReducer,
  UserLocationReducer,
});

export default indexReducer;
