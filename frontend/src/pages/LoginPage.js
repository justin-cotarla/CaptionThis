import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/LoginRegistrationPage.css';
import LoadingDots from '../components/LoadingDots'

class LoginPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userField: '',
            passField: '',
            redirect: null,
            loggingin: false,
        }
    }

    componentDidMount(){
        const cookies = new Cookies();
        const token = cookies.get('token');

        if(token) {
            this.setState({
                redirect: '/',
            });
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
        this.setState({
            loggingin: true,
        });

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
          <div className="defined-style-components">
            <div className="logo">
              <img
                  src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                  alt="Logo"

              />
          </div>
          <body className="align-user-field">
            <div className="grid">
                <form>
                    <div className="user-form-field">
                        {this.state.redirect && <Redirect to={this.state.redirect} />}
                        <label for="login_username">
                            <img
                                src={`http://${process.env.REACT_APP_IP}/res/username.png`}
                                alt="username"
                            />
                        </label>
                        <input
                            id="login_username"
                            type="username"
                            name="username"
                            className="user-form-field"
                            placeholder="Username"
                            value={this.state.userField}
                            onChange={this.onUserChange}
                            />
                    </div>
                    <div className="user-form-field">
                        <label for="loginpassword">
                            <img
                                src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                                alt="password"
                            />
                        </label>
                        <input
                            id="loginpassword"
                            type="password"
                            name="password"
                            className="user-form-field"
                            placeholder="Password"
                            value={this.state.passField}
                            onChange={this.onPassChange}
                            onKeyDown={this.onEnterPress}
                            />
                    </div>
                    <div
                        className="login2-button"
                        onClick={this.onSubmit}
                        >
                        Login
                   </div>
                </form>
                <div className="registration-button" onClick={this.onRegisterClick}>
                    <p class="text--center"> Not a member ? <a>Sign up now </a></p>
                </div>
                {this.state.loggingin &&
                <div className="login-loader-holder">
                  <LoadingDots className="login-loader"/>
                </div>
                }
            </div>
        </body>
        </div>
        );
    }
}
export default LoginPage;
