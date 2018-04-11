import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../styles/NavBar.css';
import * as AuthUtil from '../util/AuthUtil';

import LoadingDots from '../components/LoadingDots';


class NavBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            loggingOut: false,
        };
    };

    onLogoutClick = () => {
        this.setState({
            loggingOut: true,
        })
        AuthUtil.logout();
    }

    render() {
        return (
                <div className="navbar-container">
                    {
                        this.props.user &&
                        <div
                              className="logout-button"
                              onClick={this.onLogoutClick}>
                              <img
                                  alt="Logout"
                                  src={`http://${process.env.REACT_APP_IP}/res/exit.png`}
                              />
                        </div>
                    }
                    {
                        this.props.user &&
                        <Link to={`/user/${this.state.user.username}`}>
                            <div className="profile-button">
                                <img
                                    alt="Profile"
                                    src={`http://${process.env.REACT_APP_IP}/res/personIcon.png`}
                                />
                            </div>
                        </Link>
                    }

                    <Link to="/">
                        <div className="home-button">
                            <img alt="Home" src={`http://${process.env.REACT_APP_IP}/res/homeicon.png`}/>
                        </div>
                    </Link>

                    {
                        this.props.user &&
                        <Link to="/submit">
                            <div className="createMoment-button">
                                <img alt="Home" src={`http://${process.env.REACT_APP_IP}/res/createMoment.png`}/>
                            </div>
                        </Link>
                    }
                    {
                        this.props.user === null &&
                        <Link to="/login">
                            <div className="login-button">
                                <img alt="Login" src={`http://${process.env.REACT_APP_IP}/res/login.png`}/>
                            </div>
                        </Link>
                    }
                    {
                        this.state.loggingOut &&
                        <div className="logout-loader-holder">
                            <LoadingDots />
                        </div>
                    }
            </div>
        )
    }
}

export default NavBar;
