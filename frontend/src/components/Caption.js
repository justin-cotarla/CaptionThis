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
            caption: props.caption, 
            token: props.token,
        }
    }

    handleVote = (event) => {
        const token = this.state.token;
        if (token) {    
            const action = event.target.id;
            const previousVote = this.state.caption.user_vote;

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
                    caption: {
                        ...prevState.caption,
                        total_votes: prevState.caption.total_votes + (newVote - previousVote),
                        user_vote: newVote,
                    }
                }
            });

            const captionid = this.state.caption.caption_id;
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
        const previousAcceptState = this.state.caption.selected;

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

        this.setState(prevState => {
            return {
                caption: {
                    ...prevState.caption,
                    selected: newAcceptState,
                }
            }
        });

        const captionid = this.state.caption.caption_id;
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
        const { caption } = this.state;
        return (
            <div className="caption-container">
                <ul>
                    <li>
                        <CaptionVotes 
                            upvotes={caption.total_votes}
                            voteHandler={this.handleVote} 
                            id={caption.caption_id}/>
                    </li>
                    <li className="caption-content">
                        <Acceptor 
                            canAccept={this.props.canAccept} 
                            captionId={caption.caption_id} 
                            status={caption.selected} 
                            acceptHandler={this.handleAccept} />
                        <Header textSize={2} text={caption.caption}/>  
                        <Header text={`Posted by ${caption.user.username} on ${caption.date_added}`}/> 
                    </li>
                </ul>
            </div>
        )
    }
}

export default Caption;
