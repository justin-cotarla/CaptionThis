import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Header from '../components/Header';

class LoginPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userField: '',
            passField: '',
            redirect: null,
        }
    }

    onUserChange = (event) => {
        this.setState({
            userField: event.target.value,
        });
    }

    onPassChange = (event) => {
        this.setState({
            passField: event.target.value,
        });
    }

    onRegisterClick = () => {
        this.setState({
            redirect: '/register',
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        axios({
            url: `http://${process.env.REACT_APP_IP}/api/auth/login`,
            method: 'post',
            data: {
                username: this.state.userField,
                password: this.state.passField,
            },
        })
        .then(({ data }) => {
            if (data.code === 1) {
                const cookies = new Cookies();
                cookies.set('token', data.token);
                this.setState({
                    redirect: '/',
                })
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.redirect && <Redirect to={this.state.redirect} />}
                <Header textSize={4} text="Login" />

                <form
                    onSubmit={this.onSubmit}
                >
                    <label name="userid">Username: </label>
                    <input
                        type="text"
                        name="username"
                        size="12"
                        value={this.state.userField}
                        onChange={this.onUserChange}
                    />
                    
                    <label name="passid"> Password: </label>
                    <input
                        type="password"
                        name="password"
                        size="12"
                        value={this.state.passField}
                        onChange={this.onPassChange}
                    />

                    <input type="submit" value="Login" />
                </form>
                <label name="loginMessage">If you don't have an account, please register: </label>
                <input
                    type="button"
                    value="Register"
                    onClick={this.onRegisterClick}
                />
            </div>
        );
    }
}

export default LoginPage;