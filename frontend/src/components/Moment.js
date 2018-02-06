import React, { Component } from 'react';
import '../styles/Moment.css';

class Moment extends Component {
    render() {
      return (
        <div className="Moment">
            <img src={this.props.Image} className="photo" alt="logo" />
            <div className="Moment-text-container"><h1 className="Moment-title">{this.props.Description}</h1></div>
        </div>
      );
    }
  }
  
  export default Moment;