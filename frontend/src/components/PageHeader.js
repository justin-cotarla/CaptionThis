import React, { Component } from 'react';
import '../styles/PageHeader.css';
import { Redirect } from 'react-router';
import Cookies from 'universal-cookie';
import logo from '../resources/logo.png';
import base64url from 'base64url';

class PageHeader extends Component{
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
            redirect: null,
            allowBack: false,
            user: null,
        };
    };

    loadUser = () => {
        const cookies = new Cookies();
        const token =  cookies.get('token');
        if (token) {
            this.setState({
                user: base64url.decode(token.split('.')[1]),
            })
        }
    }

    componentDidMount(){
        this.loadUser();
    };

    logout = () => {
        const cookies = new Cookies();
        cookies.remove('token');
        window.location.reload();
    }

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    onProfileClick = () => {
        this.logout();
    }
    
    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    render() {
        return (
            <div className="main-container">
                {this.state.redirect && <Redirect push={this.state.allowBack} to={this.state.redirect} />}
                <div className="header">
                {this.state.user && 
                    <div
                        className="profile-button"
                        onClick={this.onProfileClick}>
                        <img
                            alt="Profile"
                            src="personIcon.png"
                        />
                    </div>
                }
                {this.state.user === null && 
                    <div
                        className="login-button"
                        onClick={this.onLoginClick}
                    >
                    Login
                    </div>
                }
                </div>
                <div className="logo">
                    <img
                        src={logo}
                        alt="Logo"
                        width="340"
                    />
                </div>
            </div>
        )
    }   
}

export default PageHeader;