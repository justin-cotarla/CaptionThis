import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';
import PageHeader from '../components/PageHeader';

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
                <PageHeader />
                <div className="login-box-container">
                    {this.state.redirect && <Redirect to={this.state.redirect} />}
                    <p><font size ="5" color="#1DE28F"> Sign Up </font></p>
                    <form
                        onSubmit={this.onSubmit}
                    >
                        <p>
                        <input
                            type="text"
                            className="text-line"
                            name="username"
                            placeholder="Username"
                            size="12"
                            value={this.state.userField}
                            onChange={this.onUserChange}
                        />
                        </p>

                        <p>
                        <input
                            type="password"
                            className="text-line"
                            name="password"
                            placeholder="Password"
                            size="12"
                            value={this.state.passField}
                            onChange={this.onPassChange}
                            onKeyDown={this.onEnterPress}
                        />
                        </p>

                        <div
                        className="registration2-button"
                        onClick={this.onSubmit}
                        >
                        Sign Up
                        </div>
                    </form>
                    <div
                        className="login2-button"
                        onClick={this.onLoginClick}
                        >
                        Login to CaptionThis
                    </div>
                </div>
            </div>
        );
    }
}

export default RegistrationPage;