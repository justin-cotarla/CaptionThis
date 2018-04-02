import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import LoadingDots from '../components/LoadingDots'
import NavBar from '../components/NavBar';

class RegistrationPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userField: '',
            passField: '',
            passConfirmField: '',
            redirect: null,
            errors: {
                loginError: '',
                userError: '',
                passError: '',
                verifyError: '',
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

    onInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        const { fields } = this.state;
        fields[name] = value;
        this.setState({ fields });
        this.validateInput(name, value);
    }

    onPassChange = (event) => {
        this.setState({
            passField: event.target.value,
        });
    }

    onPassConfirmChange = (event) => {
        this.setState({
            passConfirmField: event.target.value,
        });
    }

    onComparePasswords = () => {
        if(this.state.passField === this.state.passConfirmField){
            return true;
        }
    }

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
        });
    }

    onEnterPress = (event) => {
        if(event.keyCode === 13 && event.shiftKey === false) {
          this.onSubmit();
        }
    }

    validateInput = (name, value) => {
        const { userField, passField, passConfirmField } = this.state.fields;
        const { errors, showRegisterForm } = this.state;
        if (showRegisterForm) {
            switch (name) {
                case 'username':
                    if (userField === '') errors.userError = 'Username cannot be empty.'
                    else errors.userError = '';
                    break;
                case 'password':
                    if (passField === '') errors.passError = 'Password cannot be empty.';
                    else errors.passError = ''
                    break;
                case 'passwordConfirm':
                    if (passConfirmField === '') errors.verifyError = 'Please confirm your password.';
                    else if (passConfirmField !== passField) errors.verifyError = 'The passwords do not match!';
                    else if (passConfirmField === passField) errors.verifyError = ''
                    break;
                default: break;
            }
            this.setState({ errors });
        }
    }

    onSubmit = () => {
        axios({
            url: `http://${process.env.REACT_APP_IP}/api/auth/register`,
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
        })
        .catch(error => {
            const { errors } = this.state;
            errors.loginError = 'Invalid username or password!';
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
        const { loginError, userError, passError, verifyError } = this.state.errors;
        return (
            <div className="defined-style-components">
            <NavBar user={this.state.user}/>  
                <div className="logo">
                    <img
                        src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                        alt="Logo"
                    />
                </div>
                  <div className="registration-container">
                    <logReg-form>
                        {this.state.redirect && <Redirect to={this.state.redirect} />}
                        <form onSubmit={this.onSubmit}/>
                        <label className="input-label">
                            <img
                               src={`http://${process.env.REACT_APP_IP}/res/username.png`}
                            />
                            Username
                        </label>
                        <input
                            id="register_username"
                            type="username"
                            name="username"
                            className="input-field"
                            value={this.state.userField}
                            onChange={this.onUserChange}
                            style={ (userError || loginError) ? errorIndicator : {} }/>
                            {
                                userError && <h1 className="modal-verify-error">{userError}</h1>
                            }
                        <label className="input-label">
                            <img
                                src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                                alt="password"
                            />
                        Password
                        </label>
                        <input
                            id="password1"
                            type="password"
                            className="input-field"
                            name="password"
                            value={this.state.passField}
                            onChange={this.onPassChange}
                            style={ (passError || loginError) ? errorIndicator : {} }/>
                            {
                                (passError || loginError) && <h1 className="modal-verify-error">{passError || loginError}</h1>
                            }
                        <label className="input-label">
                            <img
                                src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                                alt="password"
                            />
                        Confirm Password
                        </label>
                        <input
                            id="password2"
                            type="password"
                            className="input-field"
                            name="passwordConfirm"
                            value={this.state.passConfirmField}
                            onChange={this.onPassConfirmChange}
                            onKeyDown={this.onEnterPress}
                            style={ verifyError ? errorIndicator : {} }/>
                            { 
                                verifyError && <h1 className="modal-verify-error">{verifyError}</h1> 
                            } 
                        <div
                            className="loginSignUp-button"
                            onClick={this.onSubmit}>
                            <a>Sign Up</a>
                      </div>
                    </logReg-form>
                    <div 
                        onClick={this.onLoginClick}>
                        <p class="signUpNow-button"> Already have an account ? <a>Login</a></p>
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

export default RegistrationPage;
