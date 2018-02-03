import React, { Component } from 'react';
import sample from '../resources/sample-moment.jpg';
import '../styles/Moment.css';

class Moment extends Component {
    render() {
      return (
        <div className="Moment">
          <header className="App-header">
            <img src={sample} className="photo" alt="logo" />
            <h1 className="Moment-title">Caption this for me people!</h1>
          </header>
        </div>
      );
    }
  }
  
  export default Moment;