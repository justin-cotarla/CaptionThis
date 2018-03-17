import React from 'react';
import '../styles/ErrorGraphic.css';

const ErrorGraphic = props => {
    return (
        <div className="error-container">
            <img className="error-image" src={`http://${process.env.REACT_APP_IP}/res/error.png`} alt="error-graphic"/>
            <h1 className="error-message">{props.message} </h1>
        </div>
    )
}

export default ErrorGraphic;
