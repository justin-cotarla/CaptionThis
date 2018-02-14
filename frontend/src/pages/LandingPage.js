import React, { Component } from 'react';
import axios from 'axios';
import MomentsList from '../components/MomentsList';
import Header from '../components/Header';
import '../styles/LandingPage.css';

class ColoredContainer extends React.Component {
  render () {
    let containerStyle = {
      backgroundColor: this.props.color
    }
    return <div className="container" style={containerStyle}></div>
  }
}

class ScrollButton extends React.Component {
  constructor() {
    super();

    this.state = {
      intervalId: 0
    };
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStepInPx);
  }

  scrollToTop() {
    let intervalId = setInterval(this.scrollStep.bind(this), this.props.delayInMs);
    this.setState({ intervalId: intervalId });
  }

  render () {
    return <button title='Back to top' className='scroll'
    onClick={ () => { this.scrollToTop(); }}>
    <span className='arrow-up glyphicon glyphicon-chevron-up'></span>
    </button>;
  }
}

class ScrollApp extends React.Component {
  constructor() {
    super();
    this.state = {
      colors: []
      // colors: ["#044747", "#079191", "#38adad", "#90e3e3", "#d5f7f7"]
    }
  }

  render () {
    return <div className="long">
    {
      this.state.colors.map(function(color) {
        return <ColoredContainer color={color}/>
      })
    }
    <ScrollButton scrollStepInPx="50" delayInMs="16.66"/>
    </div>
  }
}

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

      <div className="landing-page-container">
        <body bgcolor="#303030">
          <div id="header">
            <div id="left">
              <input type="image" id="personIcon" alt="Pic Loading..." src="personIcon.png" width="20"/>
            </div>
            <div id="right">
              <p align="right">
                <input type="button" onclick="location.href='http://google.com';" align="right" width= "100"value="Sign Up | Sign In" style={{border:"1px",height:"40px", width:"100px"}} />
              </p>
            </div>
          </div>
          <center><img src="logo.png" alt="Logo" width="340"/></center>
          <MomentsList Moments={moments}/>
          <ScrollApp>
          <div id="app">
          </div>
          </ScrollApp>
        </body>
      </div>

    );
  }
}


export default LandingPage;
