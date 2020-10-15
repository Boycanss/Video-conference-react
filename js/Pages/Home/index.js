import React, { Component } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { getUser } from '../../Store/Action/authAction';
import { connect } from 'react-redux';
import history from '../../../history';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    componentDidMount() {
        this.props.getUser();
    }

    logOut() {
        localStorage.removeItem('jwtToken');
        history.push('/')
        window.location.reload({ forceReload: false });
    }

    render() {
        let view = null;
        // const { user } = this.state;
        const userData = this.props.data
        if (!userData.name) {
            view = (
                <>
                    <h1>GET CONNECTED WITH FRIENDS</h1>
                    <br />
                    <Row xs={6}>
                        <Col>
                            <Button href='/client/auth' >LOGIN</Button><br />
                        </Col>
                    </Row>
                </>
            )
        } else {
            view = (
                <>
                    <h1>Welcome {userData.name}!</h1>
                    <br />
                    <Row xs={6}>
                        <Col>
                            <Button href='/client/stream' >Host a meeting</Button><br />
                            <Button variant='link' onClick={this.logOut} >Log out</Button><br />
                        </Col>
                    </Row>
                </>
            )
        }
        return (
            <div className="homePage">
                <div className="bodyHome">
                    {view}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.stores.authReducer.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: () => {
            dispatch(getUser());
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(index)