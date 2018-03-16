import React, { Component } from 'react';
import { Redirect } from 'react-router';

import '../styles/NavBar.css';
import * as AuthUtil from '../util/AuthUtil';


class NavBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
            redirect: null,
            allowBack: false,
            user: this.props.user,
        };
    };

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    onLogoutClick = () => {
        AuthUtil.logout();
    }

    onProfileClick = () => {
        this.setState({
            redirect: `/user/${this.state.user.username}`,
            allowBack: true,
        })
    }

    onHomeClick = () => {
        this.setState({
            redirect: '/',
            allowBack: true,
        })
    }

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    onCreateMomentClick = () => {
        this.setState({
            redirect: '/submit',
            allowBack: true,
        })
    }

    render() {
        return (
            <div className="main-container">
                {this.state.redirect && <Redirect push={this.state.allowBack} to={this.state.redirect} />}
                <div className="header">
                {this.props.user &&
                    <div
                    className="logout-button"
                    onClick={this.onLogoutClick}
                    >
                    Logout
                    </div>
                }

                {this.props.user &&
                    <div
                        className="profile-button"
                        onClick={this.onProfileClick}>
                        <img
                            alt="Profile"
                            src={`http://${process.env.REACT_APP_IP}/res/personIcon.png`}
                        />
                    </div>
                }

                {this.props.user &&
                    <div
                    className="home-button"
                    onClick={this.onHomeClick}
                    >
                    Home
                    </div>
                }

                {this.props.user &&
                    <div
                    className="createMoment-button"
                    onClick={this.onCreateMomentClick}
                    >
                    CREATE MOMENT
                    </div>
                }

                {this.props.user === null &&
                    <div
                        className="login-button"
                        onClick={this.onLoginClick}
                    >
                    Login
                    </div>
                }
                </div>
            </div>
        )
    }
}

export default NavBar;
