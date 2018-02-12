import React, { Component } from 'react';
import axios from 'axios';
import MomentsList from '../components/MomentsList';
import Header from '../components/Header';

class LandingPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            moments: null,
            error: null,
        };
    };

    componentWillMount(){
        axios.get('http://localhost:16085/api/moments').then(response => {
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
                <Header textSize={4} text={error} />
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
