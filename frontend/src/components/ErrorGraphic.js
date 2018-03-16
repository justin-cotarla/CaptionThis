import React, { Component } from 'react';
import '../styles/ErrorGraphic.css';

class Error extends Component{
    render() {
        return (
            <div className="error_container">
                <img className="error_image" src={`http://${process.env.REACT_APP_IP}/res/error.png`} alt="Error"/>
                <h1 className="error_message">{this.props.error_message} </h1>
            </div>
        )
    }   
}

export default Error;
