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
            isAuthenticating: false,
            loginError: '',
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

    onSubmit = (event) => {
        event.preventDefault();
        this.setState({
            isAuthenticating: true,
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
            const loginError = 'Incorrect username or password!';
            this.setState({
                loginError,
                isAuthenticating: false,
            });
        });
    }

    render() {
        const errorIndicator = {
            borderBottom: '2px solid rgb(255, 73, 73)',
        };
        const { userField, passField, loginError } = this.state;
        const formValid = userField.length > 0
        && passField.length > 0
        && loginError.length === 0;

        return (
            <div>
                <NavBar user={this.state.user}/>  
                {this.state.redirect && <Redirect to={this.state.redirect} />}    
                <div className="login-container">            
                    <h1 className="header-join"> Log in to CaptionThis</h1>
                    <div className="login-form-container">
                        <form className="login-page-form" onSubmit={this.onSubmit}>
                            <label className="input-label">
                                <img
                                    className="move-icons"
                                    style={{marginBottom: '-6px'}}
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
                                style={ loginError ? errorIndicator : {} }/>
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
                                style={ loginError ? errorIndicator : {} }/>
                                {
                                    loginError && <h1 className="login-verify-error">{loginError}</h1>
                                }
                            <button
                                type="submit"
                                className="loginSignUp-button"
                                style={loginError ? {marginTop: '1em'} : null}
                                disabled={!formValid || this.state.isAuthenticating}>
                                Log in
                            </button>
                            <div 
                                onClick={this.onRegisterClick}>
                                <p className="signUpNow-button">Don't have an account?<a>Sign up!</a></p>
                            </div>
                        </form>
                    </div>
                {
                    this.state.isAuthenticating &&
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
