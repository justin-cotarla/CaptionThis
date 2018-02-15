import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import base64url from 'base64-url';

import MomentsList from '../components/MomentsList';
import ScrollApp from '../components/ScrollerComponents'
import Header from '../components/Header';
import '../styles/LandingPage.css';

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
            redirect: null,
            user: null,
        };
    };

    loadUser = () => {
        const cookies = new Cookies();
        const token = cookies.get('token');
        if (token !== undefined) {
           this.setState({
               user: base64url.decode(token.split('.')[1])
           });
        }
    }

    componentWillMount(){
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
                <div className="header">
                    <div className="profile-button">
                        <img
                            alt="Profile"
                            src="personIcon.png"
                        />
                    </div>
                    <div
                        className="login-button"
                        onClick={this.onLoginClick}
                    >
                        Login
                    </div>
                </div>
                <div
                    className="logo"
                >
                    <img
                        src="logo.png"
                        alt="Logo"
                        width="340"
                    />
                </div>
                <MomentsList Moments={moments}/>
                <ScrollApp id="app"/>
            </div>
            
        );
    }
}


export default LandingPage;
