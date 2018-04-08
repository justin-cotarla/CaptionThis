import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import LoadingDots from '../components/LoadingDots'
import NavBar from '../components/NavBar';
import { GOOD, USER_EXISTS, UNKNOWN_ERROR } from '../util/ResponseCodes';

class RegistrationPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fields: {
                username: '',
                password: '',
                verify: '',
            },
            errors: {
                loginError: '',
                userError: '',
                passError: '',
                verifyError: '',
            },
            isAuthenticating: false,
            redirect: null,
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

    onInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        const { fields } = this.state;
        fields[name] = value;
        this.setState({ fields });
        this.validateInput(name, value);
    }

    validateInput = (name, value) => {
        const { password } = this.state.fields;
        const { errors } = this.state;
        switch (name) {
            case 'username':
                if (value === '') errors.userError = 'Username cannot be empty.'
                else errors.userError = '';
                break;
            case 'password':
                if (value === '') errors.passError = 'Password cannot be empty.';
                else errors.passError = ''
                break;
            case 'verify':
                if (value === '') errors.verifyError = 'Please confirm your password.';
                else if (value !== password) errors.verifyError = 'The passwords do not match!';
                else if (value === password) errors.verifyError = ''
                break;
            default: break;
        }
        this.setState({ errors });
    }

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
        });
    }



    onSubmit = (event) => {
        event.preventDefault();
        this.setState({ isAuthenticating: true });
        axios({
            url: `http://${process.env.REACT_APP_IP}/api/auth/register`,
            method: 'post',
            data: {
                username: this.state.fields.username,
                password: this.state.fields.password,
            },
        })
        .then(({ data }) => {
            if (data.code === GOOD.code) {
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
            const { code } = error.response.data;
            const { fields, errors } = this.state;
            fields.password = '';
            fields.verify = '';
            if (code === USER_EXISTS.code) {
                errors.userError = 'That username is already taken! Pick another one.';
            } else if (code === UNKNOWN_ERROR.code) {
                errors.loginError = 'There was an error while creating your account. Please try again.'
            }
            this.setState({
                fields,
                errors,
                isAuthenticating: false,
            });
        });
    }

    render() {
        const errorIndicator = {
            borderBottom: '2px solid rgb(255, 73, 73)',
        };
        const { username, password, verify } = this.state.fields;
        const { loginError, userError, passError, verifyError } = this.state.errors;
        const formValid = username.length > 0
            && password.length > 0
            && verify.length
            && userError.concat(passError, verifyError).length === 0;

        return (
            <div>
                <NavBar user={this.state.user}/>
                {this.state.redirect && <Redirect to={this.state.redirect} />}
                <h1 className="header-join">Join CaptionThis!</h1>
                <h1 className="header-join-message">A Moment is worth 64 characters... Make then count.</h1>
                <form className="registration-container" onSubmit={this.onSubmit}>         
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
                        type="text"
                        name="username"
                        className="input-field"
                        value={this.state.username}
                        onChange={this.onInputChange}
                        style={ (userError || loginError) ? errorIndicator : {} }/>
                            {
                                userError && <h1 className="login-verify-error">{userError}</h1>
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
                        className="input-field"
                        name="password"
                        value={this.state.password}
                        onChange={this.onInputChange}
                        style={ (passError || loginError) ? errorIndicator : {} }/>
                    {
                        (passError || loginError) && <h1 className="login-verify-error">{passError || loginError}</h1>
                    }
                    <label className="input-label">
                        <img
                            className="move-icons"
                            src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                            alt="password"
                        />
                    Confirm Password
                    </label>
                    <input
                        type="password"
                        className="input-field"
                        name="verify"
                        value={this.state.verify}
                        onChange={this.onInputChange}
                        onKeyDown={this.onEnterPress}
                        style={ verifyError ? errorIndicator : {} }/>
                    { 
                        verifyError && <h1 className="login-verify-error">{verifyError}</h1> 
                    } 
                    <button
                        className="loginSignUp-button"
                        disabled={!formValid || this.state.isAuthenticating}>
                        Create my account!
                    </button>
                    <div 
                        onClick={this.onLoginClick}>
                        <p className="signUpNow-button">Already have an account?<a>Log in!</a></p>
                    </div>
                </form>
                {
                    this.state.isAuthenticating && 
                    <div className="login-loader-holder">
                        <LoadingDots className="login-loader"/>
                    </div>
                }
            </div>
        );
    }
}

export default RegistrationPage;
