import React from 'react';

const Upvoter = props => {
    return (
        <div className="upvoter-container">
            <ul>
                <li className="vote-ticker" id="+" onClick={props.voteHandler}>+</li>
                <li className="vote-count">{props.upvotes}</li>
                <li className="vote-ticker" id="-" onClick={props.voteHandler}>-</li>
            </ul>
        </div>
    )
}

export default Upvoter;