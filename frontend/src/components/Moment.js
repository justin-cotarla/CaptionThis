import React from 'react';
import '../styles/Moment.css';

const Moment = props => {
    return (
        <div className="Moment-preview-container">
            <ul className="Moment-preview-layout">
                <li>
                    <div className="Moment-thumbnail" style={{backgroundImage: `url(${props.Image})`}} onClick={props.onClick}></div>
                </li>
                <li className="Moment-preview-info">
                    <h1 className='header-medium-2'>{ props.Description }</h1>
                    <h1 className="header-medium-1">Posted on { props.Date }</h1>
                    <h1 className="header-small">Submitted by { props.User }</h1>
                </li>
            </ul>
        </div>
    )
}

export default Moment;
