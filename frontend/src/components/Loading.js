import React, { Component } from 'react';
import '../styles/Loading.css';

class Loading extends Component{
    render() {
        return (
            <img className="loadicon" src={`http://${process.env.REACT_APP_IP}/res/loading.png`} alt="Loading..."/>
        )
    }   
}

export default Loading;