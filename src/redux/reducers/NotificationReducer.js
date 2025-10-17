import ActionTypes from "../ActionTypes"
const initialState = []
const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.get_all_notifications:
            return action.payload
        case ActionTypes.add_new_notification:
            return [action.payload,...state]
        case ActionTypes.notification_seen:
            return state.map(item => {
                if (item.id == action.payload) {
                    item.seen = true
                }
                return item
            })
        default:
            return state
    }
}

export default NotificationReducer