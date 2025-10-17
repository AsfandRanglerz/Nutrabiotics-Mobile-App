import ActionTypes from "../ActionTypes"

const initialState = []
const WishlistReducer = (state = initialState,action) => {
    switch(action.type){
        case ActionTypes.add_to_wishlist:
            return [...state,{...action.payload,fav:true}];
            case ActionTypes.remove_from_wishlist:
                return state.filter((item) => item.id!=action.payload.id)
            default:
            return state
    }
}

export default WishlistReducer