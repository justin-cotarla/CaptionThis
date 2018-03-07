import React, { Component } from 'react';
import '../styles/ScrollerComponents.css'

class ColoredContainer extends Component {
    render () {
      let containerStyle = {
        backgroundColor: this.props.color
      }
      return <div className="container" style={containerStyle}></div>
    }
  }

class ScrollButton extends Component {
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
      onClick={ () => { this.scrollToTop(); }}
      style={ {backgroundImage: `url(http://${process.env.REACT_APP_IP}/res/uparrow.png)` } }>
      <span className='arrow-up glyphicon glyphicon-chevron-up'></span>
      </button>;
    }
  }

  class ScrollApp extends Component {
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

export default ScrollApp;
