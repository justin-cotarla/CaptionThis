import React, { Component } from 'react';
import axios from 'axios';
import MomentsList from '../components/MomentsList';

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
        };
    };

    componentWillMount(){
        axios.get('http://192.168.99.100:16085/api/moments').then(response => {
            let moments = response.data.moments;
            this.setState({
                moments,
            });
        }).catch(error => {
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
                <h1>{error}</h1>
            </div>
        }

        return (
            <div className="landing-page-container">
                <MomentsList Moments={moments}/>
            </div>
        );
    }
}
  
  export default LandingPage;
