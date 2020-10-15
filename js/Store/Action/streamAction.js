import axios from "axios";
import history from '../../../history';
import StreamModel from '../../../api/models/stream'

import { GET_CURRENT_STREAM, SET_CURRENT_STREAM } from './type';

//get loggedIn user
export function setNewStream(dataUser) {
    return {
        type: SET_CURRENT_STREAM,
        payload: dataUser,
    }
};

// export const setStream = (user) => {
//     return (dispatch) => {
//         if (!user) {
//             return (dispatch(setNewStream('no user online')));
//         } else {
//             return (
//                 axios.post('/api/newstream', { body: user })
//                     .then(res=>{
//                         if (res.status === 200) {
                            
//                         }
//                     })

//             )
//         }
//     }
// }