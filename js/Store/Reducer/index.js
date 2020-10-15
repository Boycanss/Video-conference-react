import {combineReducers} from 'redux';

import authReducer from './authReducer';
// import postReducer from './postReducer';

const index =  combineReducers({
    authReducer
    // postReducer
})

export default index;