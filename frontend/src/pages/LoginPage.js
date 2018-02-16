import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Header from '../components/Header';
import PageHeader from '../components/PageHeader';
import '../styles/LoginRegistrationPage.css';

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
        console.log('test');
        axios({
            url: `http://${process.env.REACT_APP_IP}:16085/api/auth/login`,
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
                    redirect: '',
                })
            } else {
                console.log(data);
            }
        });
    }

    render() {
        return (
            <div>
                <PageHeader />
                <div className="login-box-container">
                    {this.state.redirect && <Redirect to={this.state.redirect} />}
                    <Header textSize={4} text="Login" />

                    <form
                        onSubmit={this.onSubmit}
                    >
                        <p>
                        <input
                            type="text"
                            name="username"
                            size="12"
                            placeholder="Username"
                            value={this.state.userField}
                            onChange={this.onUserChange}
                        /></p>
                    
                        <input
                            type="password"
                            name="password"
                            size="12"
                            placeholder="Password"                       
                            value={this.state.passField}
                            onChange={this.onPassChange}
                        />

                        <input
                            type="submit"
                            name="login"
                            className="login2-button"
                        / >
                    </form>
                    <label name="loginMessage">If you don't have an account, please sign up! </label>
                    <div
                        className="registration-button"
                        onClick={this.onRegisterClick}
                        >
                        Sign up
                        </div>
                    </div>
            </div>
        );
    }
}

export default LoginPage;