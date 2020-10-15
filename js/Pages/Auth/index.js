import React, { Component } from 'react'
import LoginCard from '../../components/LoginCard'
import RegisterCard from '../../components/RegisterCard'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap';

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true
        }
        this.toggle = this.toggle.bind(this);
    }

    async toggle() {
        await this.setState({
            login: !this.state.login
        })
    }

    render() {
        let card = null;
        if (this.state.login) {
            card = (
                <div style={{ color: 'white', fontWeight: 'bolder' }}>
                    <LoginCard />
                    <NavLink to="#" style={{ position: 'relative', textDecoration: 'none' }}
                        onClick={this.toggle}
                    >Daftar Sekarang!</NavLink>
                </div>
            )
        } else {
            card = (
                <div style={{ color: 'white', fontWeight: 'bolder' }}>
                    <RegisterCard />
                    <NavLink to="#" style={{ position: 'relative', textDecoration: 'none' }}
                        onClick={this.toggle}
                    >Login Sekarang!</NavLink>
                </div>
            )
        }

        return (
            <div className="authContainer">
                <Container>
                    <Row className="justify-content-md-center" lg={3}>
                        <Col>
                            <h3 style={{ color: 'white' }}><a href="/">Back</a></h3>
                            {card}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
