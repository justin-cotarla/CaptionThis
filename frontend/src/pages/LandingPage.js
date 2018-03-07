import React, { Component } from 'react';
import axios from 'axios';
import MomentsList from '../components/MomentsList';
import ScrollApp from '../components/ScrollerComponents'

import Header from '../components/Header';
import PageHeader from '../components/PageHeader';
import Loading from '../components/Loading';

import '../styles/LandingPage.css';

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
        };
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
            return <div className="landing-page-container">
            <Header textSize={4} text={error} />
            </div>
        }
        return (
            <div>
                <PageHeader />
                <div>
                    {moments ? (
                        <MomentsList
                         Moments={moments} MomentList/>
                    ) : (
                        <Loading />
                    )}

                    <ScrollApp id="app"/>
                </div>
            </div>
        )
    }
}


export default LandingPage;
