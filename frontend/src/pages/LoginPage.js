import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
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

    onEnterPress = (event) => {
        if(event.keyCode === 13 && event.shiftKey === false) {
          this.onSubmit();
        }
    }

    onSubmit = () => {
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
                    <p><font size ="5" color="#1DE28F"> Login </font></p>

                    <form>
                        <p>
                        <input
                            type="text"
                            className="text-line"
                            name="username"
                            size="12"
                            placeholder="Username"
                            value={this.state.userField}
                            onChange={this.onUserChange}
                        /></p>
                    
                        <input
                            type="password"
                            className="text-line"
                            name="password"
                            size="12"
                            placeholder="Password"                       
                            value={this.state.passField}
                            onChange={this.onPassChange}
                            onKeyDown={this.onEnterPress}
                        />

                        <div
                        className="login1-button"
                        onClick={this.onSubmit}
                        >
                        Login
                        </div>
                    </form>
                    
                    <div
                        className="registration-button"
                        onClick={this.onRegisterClick}
                        >
                        Sign up for CaptionThis
                        </div>
                    </div>
            </div>
        );
    }
}

export default LoginPage;