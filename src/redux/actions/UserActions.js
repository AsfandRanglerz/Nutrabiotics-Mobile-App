import ActionTypes from "../ActionTypes"

const addUpdateUser = (data) => ({
    type:ActionTypes.add_update_user,
    payload:data
})

export {addUpdateUser}