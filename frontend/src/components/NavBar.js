import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

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
                                  src={`http://${process.env.REACT_APP_IP}/res/exit.png`}
                              />
                        </div>
                    }

                    {this.props.user &&
                        <Link to={`/user/${this.state.user.username}`}>
                            <div className="profile-button">
                                <img
                                    alt="Profile"
                                    src={`http://${process.env.REACT_APP_IP}/res/personIcon.png`}
                                />
                            </div>
                        </Link>
                    }

                        <div
                        className="home-button"
                        onClick={this.onHomeClick}>
                        <img
                            alt="Home"
                            src={`http://${process.env.REACT_APP_IP}/res/homeicon.png`}
                        />
                        </div>

                    {this.props.user &&
                        <div
                        className="createMoment-button"
                        onClick={this.onCreateMomentClick}
                        >
                        <img
                            alt="Home"
                            src={`http://${process.env.REACT_APP_IP}/res/createMoment.png`}
                        />
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
