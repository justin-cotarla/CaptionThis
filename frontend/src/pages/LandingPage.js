import React, { Component } from 'react';
import axios from 'axios';
import Moment from '../components/Moment';
// import sample from '../resources/sample-moment.jpg';
// import logo from '../resources/logo.svg';
// import tai from '../resources/TaiLopez.png';

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
                <h1>{error}</h1>
            </div>
        }

        return (
            <div className="landing-page-container">
                <ul className="moments-list">
                    {
                        moments && moments.map(moment => {
                            return (
                                <li key={moment.moment_id} className="moment-list-item">
                                    <Moment Image={ moment.img } Date={ moment.date_added } Description={ moment.description } />
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}
  
  export default LandingPage;