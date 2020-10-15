import { SET_CURRENT_USER, GET_CURRENT_USER } from "../Action/type"

const initialState = {
    user: {}
};

const authReducer = (state = initialState, action) => {
    // console.log(action.payload);
    switch (action.type) {
        case SET_CURRENT_USER:
            // console.log('this is Set current user');
            return {
                ...state,
                user: action.payload
            };
        case GET_CURRENT_USER:
            // console.log('this is Get current user');
            // const result = state.user.push(action.payload);
            return {
                ...state,
                user: action.payload
            }
        default: return state;
    }
}

// const authReducer = (prevstate = initialState, action) => {
//     // console.log(action.type);
//     // console.log(action.isLoggedIn);
//     // console.log(action.payload);
//     switch (action.type) {
//         case SET_CURRENT_USER:
//             return {
//                 ...prevstate,
//                 isAuthenticated: true,
//                 user: action.payload
//             };
//         case GET_CURRENT_USER:
//             return {
//                 ...prevstate,
//                 isAuthenticated: action.isLoggedIn,
//                 user: action.payload
//             }
//         default: return prevstate;
//     }
// }

export default authReducer;