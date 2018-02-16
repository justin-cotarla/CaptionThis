import React, { Component } from 'react';
import { Redirect } from 'react-router';

import '../styles/PageHeader.css';
import * as AuthUtil from '../util/AuthUtil';


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

    componentDidMount(){
        AuthUtil.authenticate()
            .then((user) => {
                this.setState({
                    user,
                });
            })
            .catch((err) => {
                this.setState({
                    user: null,
                });
            })
    };

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    onProfileClick = () => {
        AuthUtil.logout();
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
                            src={`http://${process.env.REACT_APP_IP}/res/personIcon.png`}
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
                        src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                        alt="Logo"
                        width="340"
                    />
                </div>
            </div>
        )
    }   
}

export default PageHeader;