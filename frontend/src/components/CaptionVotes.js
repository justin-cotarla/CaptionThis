import React from 'react';
import '../styles/CaptionVotes.css';

const CaptionVotes = props => {
    var upVote = <li className="vote-ticker" id="+" onClick={props.voteHandler}>+</li>
    var downVote = <li className="vote-ticker" id="-" onClick={props.voteHandler}>-</li>

    switch (props.vote_value) {      
        case 1:
            upVote = <li className="vote-up" id="+" onClick={props.voteHandler}>+</li>
            break;

        case -1:
            downVote = <li className="vote-down" id="-" onClick={props.voteHandler}>-</li>
            break;
        
        default:
            break;
    }

    return (
        <div className="caption-votes-container">
            <ul>
                {upVote}
                <li className="vote-count">{props.upvotes}</li>
                {downVote}
            </ul>
        </div>
    )
}

export default CaptionVotes;
