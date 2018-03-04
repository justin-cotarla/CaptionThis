import React from 'react';
import '../styles/CaptionVotes.css';

const CaptionVotes = props => {
    return (
        <div className="caption-votes-container">
            <ul>
                <li className="vote-ticker" id="+" onClick={props.token && props.voteHandler}>+</li>
                <li className="vote-count">{props.upvotes}</li>
                <li className="vote-ticker" id="-" onClick={props.token && props.voteHandler}>-</li>
            </ul>
        </div>
    )
}

export default CaptionVotes;