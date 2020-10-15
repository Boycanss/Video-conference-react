import React, { Component } from 'react';
import history from '../../../history'
import { Form, Button } from 'react-bootstrap'
import { connect } from 'react-redux';
import { loginUser } from '../../Store/Action/authAction'

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        //from login form
        this.emailOnChange = this.emailOnChange.bind(this);
        this.pwdOnChange = this.pwdOnChange.bind(this);
    }

    //from login form
    emailOnChange(e) {
        this.setState({ email: e.target.value })
    }

    pwdOnChange(e) {
        this.setState({ password: e.target.value })
    }

    componentDidMount() {
        window.addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                this.SubmitLogin()
            } else {
                return;
            }
        })
    }


    SubmitLogin = () => {
        // e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.loginUser(userData);
    }


    render() {
        return (
            <Form style={{ color: 'white', fontWeight: 'Bolder' }}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Masukkan Email" onChange={this.emailOnChange} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Masukkan Password" onChange={this.pwdOnChange} />
                </Form.Group>
                <Button variant="primary" onClick={this.SubmitLogin}>
                    Submit
                </Button>
                <br />
                <br />
                <p>atau</p>
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.isAuthenticated,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (userData) => {
            dispatch(loginUser(userData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(index)