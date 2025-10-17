import ActionTypes from "../ActionTypes"

const initialState = null
const UserReducer = (state = initialState,action) => {
    switch(action.type){
        case ActionTypes.add_update_user:
            return action.payload;
        default:
            return state
    }
}

export default UserReducer