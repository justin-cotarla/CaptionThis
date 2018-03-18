import React, { Component } from 'react';
import { Redirect } from 'react-router';

import '../styles/NavBar.css';
import * as AuthUtil from '../util/AuthUtil';

import LoadingDots from '../components/LoadingDots';


class NavBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
            redirect: null,
            allowBack: false,
            user: this.props.user,
            loggingOut: false,
        };
    };

    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    onLogoutClick = () => {
        this.setState({
            loggingOut: true,
        })
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
                <div className="navbar-container">
                    {this.state.redirect && <Redirect push={this.state.allowBack} to={this.state.redirect} />}
                    {this.props.user &&
                        <div
                              className="logout-button"
                              onClick={this.onLogoutClick}>
                              <img
                                  alt="Logout"
                                  src={`http://${process.env.REACT_APP_IP}/res/logout.png`}
                              />
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
                        onClick={this.onHomeClick}>
                        <img
                            alt="Home"
                            src={`http://${process.env.REACT_APP_IP}/res/homeicon.png`}
                        />
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
                            onClick={this.onLoginClick}>
                            <img
                                alt="Login"
                                src={`http://${process.env.REACT_APP_IP}/res/login.png`}
                            />

                        </div>
                    }

                    {this.state.loggingOut &&
                        <div className="logout-loader-holder">
                            <LoadingDots />
                        </div>
                    }

            </div>
        )
    }
}

export default NavBar;
