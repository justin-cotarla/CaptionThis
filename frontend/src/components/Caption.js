import React from 'react';
import Header from './Header';

import '../styles/Caption.css';

const Caption = props => {
    return (
        <div className="caption-container">
            <ul>
                <li><Upvoter upvotes={props.upvotes} handler={props.handler}/></li>
                <li>  
                    <Header textSize={2} text={props.caption}/>
                    <Header text={`Posted by ${props.username} on ${props.date}`}/>
                </li>
            </ul>
        </div>
    )
}

const Upvoter = props => {
    return (
        <div className="upvoter-container">
            <ul>
                <li id="+" onClick={props.handler}>+</li>
                <li>{props.upvotes}</li>
                <li id="-" onClick={props.handler}>-</li>
            </ul>
        </div>
    )
}

export default Caption;