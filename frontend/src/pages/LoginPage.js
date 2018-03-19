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
          <div>
            <div className="logo">
              <img
                  src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                  alt="Logo"
                  onClick={this.onLogoClick}
              />
          </div>
          <body className="align">
            <div className="grid">
                <form>
                    <div className="form__field">
                        {this.state.redirect && <Redirect to={this.state.redirect} />}
                        <label for="login__username">
                            <img
                                src={`http://${process.env.REACT_APP_IP}/res/username.png`}
                                alt="username"
                                onClick={this.onLogoClick}/>
                        </label>
                        <input
                            id="login__username"
                            type="username"
                            name="username"
                            className="form__input"
                            placeholder="Username"
                            value={this.state.userField}
                            onChange={this.onUserChange}
                            required/>
                    </div>
                    <div className="form__field">
                        <label for="loginpassword">
                            <img
                                src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                                alt="password"
                                onClick={this.onLogoClick}/>
                        </label>
                        <input
                            id="loginpassword"
                            type="password"
                            name="password"
                            className="form__input"
                            placeholder="Password"
                            value={this.state.passField}
                            onChange={this.onPassChange}
                            onKeyDown={this.onEnterPress}
                            required/>
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
