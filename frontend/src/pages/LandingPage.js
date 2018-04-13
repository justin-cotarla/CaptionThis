import React, { Component } from 'react';
import MomentList from '../components/MomentList';
import ScrollApp from '../components/ScrollerComponents'
import NavBar from '../components/NavBar';

import { fetchMoments } from '../util/ApiUtil';

import '../styles/LandingPage.css';

class LandingPage extends Component {
    MOMENT_RANGE = 30;

    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
            user: props.user,
            token: props.token,
        };
        props.validateToken()
            .then(token => {
                this.setState({ token });
            })
            .catch(err => {
                this.setState({
                    user: null,
                    token: null,
                });
            });
    };

    render() {
        const { token } = this.state;
        return (
            <div className="landing-page-container">
                <NavBar user={this.state.user}/>
                    <img
                        className="logo"
                        src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                        alt="Logo"
                        width="340"
                        onClick={this.onLogoClick} />
                <MomentList
                    showSubmittedBy={true}
                    user={this.state.user}
                    token = {this.state.token}
                    fetchMoments={(filter, page) => fetchMoments({ 
                        token,
                        filter,
                        range: this.MOMENT_RANGE,
                        start: this.MOMENT_RANGE * page,
                    })}/>          
                <ScrollApp id="app"/>
            </div>
        )
    }
}

export default LandingPage;
