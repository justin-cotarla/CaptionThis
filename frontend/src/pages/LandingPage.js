import React, { Component } from 'react';
import axios from 'axios';
import MomentsList from '../components/MomentsList';
import ScrollApp from '../components/ScrollerComponents'

import NavBar from '../components/NavBar';
import Loading from '../components/Loading';
import ErrorGraphic from '../components/ErrorGraphic';

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

    componentDidMount(){
        axios.get(`http://${process.env.REACT_APP_IP}/api/moments`)
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
            return <ErrorGraphic error_message={error}/>
        }
        return (
            <div>
                <NavBar user={this.state.user}/>

                <div className="logo">
                    <img
                        src={`http://${process.env.REACT_APP_IP}/res/logo.png`}
                        alt="Logo"
                        width="340"
                        onClick={this.onLogoClick}
                    />
                </div>

                <div>
                    {moments ? (
                        <MomentsList
                         Moments={moments}
                         showSubmittedBy={true} />
                    ) : (
                        <Loading />
                    )}
                    <div class="Moment-preview-container">
                      <div class="Moment-overlay"></div>

                    </div>


                    <ScrollApp id="app"/></div>
              </div>
        )
    }
}

export default LandingPage;
