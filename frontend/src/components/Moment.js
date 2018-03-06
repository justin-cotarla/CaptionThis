import React from 'react';
import Header from './Header';
import '../styles/Moment.css';

const Moment = props => {
    return (
        <div className="Moment-preview-container">
            <ul className="Moment-preview-layout">
                <li>
                    <div className="Moment-thumbnail" style={{backgroundImage: `url(${props.image})`}} onClick={props.onClick}></div>
                </li>
                <li className="Moment-preview-info">
                    <center>
                      <Header textSize={4} text={ props.description } />
                    </center>
                    <Header textSize={3} text={'Posted on ' + props.date } />
                    <Header textSize={2} text={ 'Submitted by ' + props.user } />
                </li>
            </ul>
        </div>
    )
}

export default Moment;
