import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import LoadingDots from '../components/LoadingDots'

class RegistrationPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userField: '',
            passField: '',
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
                            <form onSubmit={this.onSubmit}/>
                            <label>
                                <img
                                    src={`http://${process.env.REACT_APP_IP}/res/username.png`}
                                    alt="username"
                                    onClick={this.onLogoClick}
                                />
                            </label>
                            <input
                                id="register__username"
                                type="username"
                                name="username"
                                className="form__input"
                                placeholder="Username"
                                value={this.state.userField}
                                onChange={this.onUserChange}
                                required>
                          </input>
                      </div>
                      <div className="form__field">
                          <label for="registerpassword1">
                              <img
                                  src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                                  alt="password"
                                  onClick={this.onLogoClick}
                              />
                             </label>
                        <input
                            id="password1"
                            type="password"
                            className="form__input"
                            name="password1"
                            placeholder="Password"
                            value={this.state.passField1}
                            onChange={this.onPassChange}
                            onKeyDown={this.onEnterPress}
                            required/>
                        </div>
                        <div className="form__field">
                            <label for="registerpassword2">
                                <img
                                    src={`http://${process.env.REACT_APP_IP}/res/password.png`}
                                    alt="password"
                                    onClick={this.onLogoClick}/>
                           </label>
                           <input
                              id="password2"
                              type="password"
                              className="form__input"
                              name="password2"
                              placeholder="Confirm Password"
                              value={this.state.passField2}
                              onChange={this.onPassChange}
                              onKeyDown={this.onEnterPress}
                              required/>
                        </div>
                        <div
                            className="signup-button"
                            onClick={this.onSubmit}>
                            <a>Sign Up</a>
                      </div>
                    </form>
                    <div
                        className="login2-button"
                        onClick={this.onLoginClick}
                        >
                        Login
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

export default RegistrationPage;
