import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';

class RegistrationPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userField: '',
            passField: '',
            redirectToMain: false,
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

    onSubmit = (event) => {
        event.preventDefault();
        axios({
            url: `http://${process.env.REACT_APP_IP}:16085/api/auth/register`,
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
                    redirectToMain: true,
                })
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.redirectToMain && <Redirect to="/" />}
                <h1>Sign Up</h1>
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

                    <input type="submit" value="Sign Up" />
                </form>
                <label name="loginMessage">If you already have an account, please login: </label>
                <input type="button" value="Login" />
            </div>
        );
    }
}

export default RegistrationPage;