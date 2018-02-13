import React, { Component } from 'react';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            moment: null,
        };
    };

    render() {
      console.log(this.state.momentID);
      return (
        <h1>{this.state.momentID}</h1>
      );
    }
  }
  
  export default MomentViewPage;