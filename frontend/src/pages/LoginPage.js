import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import '../styles/LoginRegistrationPage.css';
import LoadingDots from '../components/LoadingDots'
import NavBar from '../components/NavBar';

class LoginPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userField: '',
            passField: '',
            redirect: null,
            loggingin: false,
            errors: {
                loginError: '',
                userError: '',
                passError: '',
            },
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
        })
        .catch(error => {
            const { errors } = this.state;
            errors.loginError = 'Incorrect username or password!';
            this.setState({
                errors,
                loggingin: false,
            });
        });
    }

    render() {
        const errorIndicator = {
            borderBottom: '2px solid #ff0000',
        };
        const { loginError, userError, passError} = this.state.errors;

        return (
          <div> <NavBar user={this.state.user}/>                    
            <div className="logo">
                <img
                    src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                    alt="Logo"
                />
            </div>
            <div className="login-container">
                {this.state.redirect && <Redirect to={this.state.redirect} />}
                <label className="container-label"> Log in to your account </label>
                <label className="input-label">
                    <img
                        className="move-icons"
                        src={`http://${process.env.REACT_APP_IP}/res/username.png`}
                        alt="username"
                    />
                    Username
                </label>
                <input
                    type="username"
                    name="username"
                    className="input-field"
                    value={this.state.userField}
                    onChange={this.onUserChange}
                    style={ (userError || loginError) ? errorIndicator : {} }/>    
                    {
                        <h1 className="login-verify-error">{userError}</h1>
                    }
                <label className="input-label">
                    <img
                        className="move-icons"
                        src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                        alt="password"
                    />
                    Password
                </label>
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        value={this.state.passField}
                        onChange={this.onPassChange}
                        onKeyDown={this.onEnterPress}
                        style={ (passError || loginError) ? errorIndicator : {} }/>
                        {
                            <h1 className="login-verify-error">{passError || loginError}</h1>
                        }
                <div
                    className="loginSignUp-button"
                    onClick={this.onSubmit}
                    >
                    Login
                </div>
                <div 
                    onClick={this.onRegisterClick}>
                    <p className="signUpNow-button"> Not a member ? <a>Sign up now </a></p>
                </div>
                {this.state.loggingin &&
                <div className="login-loader-holder">
                  <LoadingDots className="login-loader"/>
                </div>
                }
            </div>
            </div>
        );
    }
}
export default LoginPage;
