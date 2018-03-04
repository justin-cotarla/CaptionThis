import React from 'react';
import axios from 'axios';
import Header from './Header';
import CaptionVotes from './CaptionVotes';
import Acceptor from './Acceptor';

import '../styles/Caption.css';

class Caption extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ...props.caption, 
            token: props.token,
        }
    }

    handleVote = (event) => {
        const token = this.state.token;
        if (token) {    
            const action = event.target.id;
            const previousVote = this.state.user_vote;

            let newVote;
            switch (previousVote) {
                case 0:
                    newVote = (action === '+') ? 1 : -1; 
                    break;
                case 1:
                    newVote = (action === '+') ? 0 : -1;
                    break;
                case -1:
                    newVote = (action === '+') ? 1 : 0;
                    break;
                default: break;
            }

            this.setState(prevState => {
                return {
                    total_votes: prevState.total_votes + (newVote - previousVote),
                    user_vote: newVote,
                }
            });

            const captionid = this.state.caption_id;
            const data = { 
                operation: 'vote', 
                value: newVote,
            };
            const headers = { 
                'Authorization': `Bearer ${token}` 
            };

            axios({
                method: 'post',
                url: `http://${process.env.REACT_APP_IP}/api/captions/${captionid}`,
                data: data,
                headers: headers,
            })
            .catch(error => console.log(error));
        } 
    }

    handleAccept = (event) => {
        const action = event.target.id;
        const token = this.state.token;
        const previousAcceptState = this.state.selected;

        let newAcceptState;
        switch (previousAcceptState) {
            case 0:
                newAcceptState = (action === 'accept') ? 1 : -1;
                break;
            case 1:
                newAcceptState = (action === 'accept') ? 0 : -1;
                break;
            case -1:
                newAcceptState = (action === 'accept') ? 1 : 0;
                break;
            default: break;
        }

        this.setState({
            selected: newAcceptState,
        });

        const captionid = this.state.caption_id;
        const data = { 
            operation: 'select', 
            value: newAcceptState, 
        };
        const headers = { 
            'Authorization': `Bearer ${token}` 
        };

        axios({
            method: 'post',
            url: `http://${process.env.REACT_APP_IP}/api/captions/${captionid}`,
            data: data,
            headers: token ? headers : {}
        })
        .catch(error => console.log(error)); 
    }

    render(){
        return (
            <div className="caption-container">
                <ul>
                    <li>
                        <CaptionVotes 
                            token={this.state.token}
                            upvotes={this.state.total_votes}
                            voteHandler={this.handleVote} 
                            id={this.state.caption_id}/>
                    </li>
                    <li className="caption-content">
                        <Acceptor 
                            token={this.state.token} 
                            captionId={this.state.caption_id} 
                            status={this.state.selected} 
                            acceptHandler={this.handleAccept} />
                        <Header textSize={2} text={this.state.caption}/>  
                        <Header text={`Posted by ${this.state.user.username} on ${this.state.date_added}`}/> 
                    </li>
                </ul>
            </div>
        )
    }
}

export default Caption;