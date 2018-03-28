import React, { Component } from 'react';
import MomentList from '../components/MomentList';
import ScrollApp from '../components/ScrollerComponents'
import NavBar from '../components/NavBar';

import { fetchMoments } from '../util/apiUtil';

import '../styles/LandingPage.css';

class LandingPage extends Component {
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
                    fetchMoments={(filter) => fetchMoments({ 
                        token, 
                        filter, 
                        range: 30, 
                    })}/>          
                <ScrollApp id="app"/>
            </div>
        )
    }
}

export default LandingPage;
