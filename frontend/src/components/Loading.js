import React, { Component } from 'react';
import loader from '../resources/loading.png';
import '../styles/Loading.css';

class Loading extends Component{
    render() {
        return (
            <img className="loadicon" src={loader} alt="Loading..."/>
        )
    }   
}

export default Loading;