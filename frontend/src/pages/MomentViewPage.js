import React, { Component } from 'react';

class MomentViewPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            moment: null,
        };
    };

    render() {
      return (
        <h1>MOMENTVIEW</h1>
      );
    }
  }
  
  export default MomentViewPage;