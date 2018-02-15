import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import MomentsList from '../components/MomentsList';
import ScrollApp from '../components/ScrollerComponents'
import Cookies from 'universal-cookie';
import base64url from 'base64url';

import Header from '../components/Header';
import '../styles/LandingPage.css';

class LandingPage extends Component {
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
        axios.get(`http://${process.env.REACT_APP_IP}:16085/api/moments`)
        .then(response => {
            let moments = response.data.moments;
            this.setState({
                moments,
            });
        })
        .catch(error => {
            console.log(error);
            this.setState({
                error: 'Oops! Something went wrong...'
            });
        });
    };
    
    onLoginClick = () => {
        this.setState({
            redirect: '/login',
            allowBack: true,
        })
    }

    onProfileClick = () => {
        
    }
    
    render() {
        const moments = this.state.moments;
        const error = this.state.error;
        
        // Return an error message if moments could not be loaded
        if (error) {
            return <div className="landing-page-container">
            <Header textSize={4} text={error} />
            </div>
        }

        return (
            <div>
                {this.state.redirect && <Redirect push={this.state.allowBack} to={this.state.redirect} />}
                <div className="header">
                {this.state.user && 
                    <div className="profile-button">
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
                        src="logo.png"
                        alt="Logo"
                        width="340"
                    />
                </div>
                <div>
                    <MomentsList Moments={moments}/>
                    <ScrollApp id="app"/>
                </div>
            </div>
        );
    }
}


export default LandingPage;
