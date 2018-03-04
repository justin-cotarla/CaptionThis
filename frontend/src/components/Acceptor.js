import React from 'react';
import '../styles/Acceptor.css';

const Acceptor = (props) => {
    const acceptState = props.status;
    let acceptStatus = '';
    if (acceptState)
        acceptStatus = (acceptState === 1) ? 'ACCEPTED' : 'REJECTED'; 

    return (
        <ul className="accept-reject">
            { props.isReadOnly && <li id="accept" value={props.caption_id} onClick={props.acceptHandler}>Accept</li> }
            { props.isReadOnly && <li>|</li> }
            { props.isReadOnly && <li id="reject" value={props.caption_id} onClick={props.acceptHandler}>Reject</li> }        
            <li>{acceptStatus}</li>
        </ul>
    )
}

export default Acceptor;
