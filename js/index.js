import { Route, Redirect } from 'react-router-dom';
import React, { Component } from 'react'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Pages/Home/index';
import Auth from './Pages/Auth';
import Stream from './Pages/Stream';

export default class routes extends Component {

    render() {
        return (
            <div>
                <Route exact path="/">
                    <Redirect to="/client/" />
                </Route>
                <Route exact path="/client/" component={Home} />
                <Route exact path="/client/auth" component={Auth} />
                <Route exact path="/client/stream" component={Stream} />
            </div>
        )
    }
}
