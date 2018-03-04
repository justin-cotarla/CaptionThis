import React from 'react';
import '../styles/Acceptor.css';

const Acceptor = (props) => {
    const acceptState = props.status;
    let acceptStatus = '';
    switch(acceptState){
        case 1:
            acceptStatus = 'ACCEPTED';
            break;
        case -1:
            acceptStatus = 'REJECTED';
            break;
        default: break;
    }

    return (
        <ul className="accept-reject">
            { props.token && <li id="accept" value={props.caption_id} onClick={props.acceptHandler}>Accept</li> }
            { props.token && <li>|</li> }
            { props.token && <li id="reject" value={props.caption_id} onClick={props.acceptHandler}>Reject</li> }        
            <li>{acceptStatus}</li>
        </ul>
    )
}

export default Acceptor;