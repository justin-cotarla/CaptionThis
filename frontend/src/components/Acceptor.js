import React from 'react';

const Acceptor = (props) => {
    const previousAcceptState = this.state.selected;
    let acceptStatus = '';
    switch(previousAcceptState){
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
            { props.token && <li id="accept" value={props.caption_id} onClick={props.handleAccept}>Accept</li> }
            { props.token && <li>|</li> }
            { props.token && <li id="reject" value={props.caption_id} onClick={props.handleAccept}>Reject</li> }        
            <li>{props.status}</li>
        </ul>
    )
}

export default Acceptor;