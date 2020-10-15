import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import authReducer from './Reducer/authReducer';

const initialState = {};
const middleware = [thunk];

const store = createStore(
    authReducer,
    initialState,
    compose(
        applyMiddleware(...middleware)
    )
);

export default store;