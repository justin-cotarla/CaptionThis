import React, { Component } from 'react';
import axios from 'axios';
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
    };
  };

  componentWillMount(){
    axios.get(`http://${process.env.REACT_APP_IP}:16085/api/moments`).then(response => {
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
        
        <body bgcolor="#303030">
          <div id="header">
            <div id="left">
              <img id="personIcon" alt="Pic Loading..." src="personIcon.png" width="20"/>
            </div>
            <div id="right">
              <p align="right">
                <button onclick="location.href='http://google.com';" align="right" width= "100"value="Sign Up | Sign In" style={{border:"1px",height:"40px", width:"100px"}} />
              </p>
            </div>
          </div>
          <center><img src="logo.png" alt="Logo" width="340"/></center>
          <MomentsList Moments={moments}/>
          <ScrollApp id="app"/>
        </body>

    );
  }
}


export default LandingPage;
