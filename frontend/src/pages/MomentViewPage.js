import React, { Component } from 'react';
import axios from 'axios';
import MomentsList from '../components/MomentsList';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            moment: null,
        };
    };

    render() {
      return (
        {moment}
      );
    }
  }
  
  export default MomentViewPage;