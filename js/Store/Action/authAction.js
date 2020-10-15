import axios from "axios";
import history from '../../../history';

import { GET_CURRENT_USER, SET_CURRENT_USER } from './type';

//translating type into functions

//get loggedIn user
export function getCurrentUser(dataUser, loggedIn) {
    return {
        type: GET_CURRENT_USER,
        payload: dataUser,
        isLoggedIn: loggedIn
    }
};

//set logged in user
export function setCurrentUser(dataUser) {
    return {
        type: SET_CURRENT_USER,
        payload: dataUser
    }
};

export const getUser = () => {
    return (dispatch) => {
        // console.log(localStorage.getItem('jwtToken'));
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            return (dispatch(getCurrentUser('no user online', false)));
        } else {
            // console.log('token accepted');
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            return (
                dispatch(getCurrentUser(JSON.parse(window.atob(base64)), true))
            )
        }
    }
}

export const loginUser = (userData) => {
    return (dispatch) => {
        return (
            axios.post("/api/users/login", userData)
                .then(res => {
                    console.log(res.status);
                    if (res.status === 200) {
                        localStorage.setItem('jwtToken', res.data.token);
                        dispatch(setCurrentUser(res.data))
                        history.push("/");
                        window.location.reload({ forceReload: false })
                    }
                    else if (res.status === 400) {
                        alert(res.data)
                    }
                })
                .catch(err => dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                }))
        )
    }
}

