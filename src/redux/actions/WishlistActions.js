import ActionTypes from "../ActionTypes";

const addToWishlist = (item) => ({
    type: ActionTypes.add_to_wishlist,
    payload: item
})
const removeFromWishlist = (item) => ({
    type: ActionTypes.remove_from_wishlist,
    payload: item
})

export { addToWishlist, removeFromWishlist }