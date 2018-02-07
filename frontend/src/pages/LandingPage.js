import React, { Component } from 'react';
import Moment from '../components/Moment';
import sample from '../resources/sample-moment.jpg';
import logo from '../resources/logo.svg';
import tai from '../resources/TaiLopez.png';

class LandingPage extends Component {
    render() {
      return (
        <ul>
            <li><Moment Description={"Find me a cool caption!"} Image={sample} Date={"06/02/2018"} /></ li>
            <li><Moment Description={"Good caption to go with this?"} Image={logo} Date={"04/01/2018"} /></ li>
            <li><Moment Description={"Me in my garage"} Image={tai} Date={"02/11/2017"} /></ li>
        </ul>
      );
    }
  }
  
  export default LandingPage;