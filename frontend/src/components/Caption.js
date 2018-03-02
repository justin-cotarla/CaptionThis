import React from 'react';
import Header from './Header';

import '../styles/Caption.css';

const Caption = props => {
    let acceptStatus = '';
    if(props.selected === -1){
        acceptStatus = 'REJECTED';
    } else if(props.selected === 1){
        acceptStatus = 'ACCEPTED';
    }

    return (
        <div className="caption-container">
            <ul>
                <li>
                    <Upvoter upvotes={props.upvotes} handler={props.voteHandler} id={props.id}/>
                </li>
                <li>
                <ul className="accept-reject">
                    { props.token && <li id="accept" value={props.id} onClick={props.acceptHandler}>Accept</li> }
                    { props.token && <li>|</li> }
                    { props.token && <li id="reject" value={props.id} onClick={props.acceptHandler}>Reject</li> }        
                    <li>{acceptStatus}</li>
                </ul>
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
                <li className="vote-ticker" id="+" value={props.id} onClick={props.handler}>+</li>
                <li className="vote-count">{props.upvotes}</li>
                <li className="vote-ticker" id="-" value={props.id} onClick={props.handler}>-</li>
            </ul>
        </div>
    )
}

export default Caption;