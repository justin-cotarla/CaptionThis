import React from 'react';
import '../styles/CaptionVotes.css';

const CaptionVotes = props => {
    let upVote = <li className="vote-ticker-plus" id="+" onClick={props.voteHandler}>+</li>
    let downVote = <li className="vote-ticker-minus" id="-" onClick={props.voteHandler}>-</li>

    switch (props.vote_value) {      
        case 1:
            upVote = <li className="vote-ticker-plus" style={{color: '#1DE28F'}} id="+" onClick={props.voteHandler}>+</li>
            break;
        case -1:
            downVote = <li className="vote-ticker-minus" style={{color: '#f44b42'}} id="-" onClick={props.voteHandler}>-</li>
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
