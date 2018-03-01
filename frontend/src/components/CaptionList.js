import React from 'react';
import axios from 'axios';

import Caption from './Caption';
import Header from './Header';

import '../styles/CaptionList.css';

class CaptionList extends React.Component {
    handleVote = (event) => {
        console.log(this.props.token)
        const captionid = event.target.value;
        const action = event.target.id;

        const captions = this.props.captions;
        const caption = captions.filter(caption => caption.caption_id === captionid)[0];
        const previousVote = caption.user_vote;

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
        this.props.onCaptionUpdate({
            ...caption,
            total_votes: caption.total_votes + (newVote - previousVote),
            user_vote: newVote,
        });
        const data = { 
            operation: 'vote', 
            value: newVote,
        };
        const config = { 
            headers: { 
                'Authorization': `Bearer ${this.props.token}` 
            },
        };
        return axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, data, config)
        .catch(error => console.log(error)); 
    }

    handleAccept = (event) => {
        const captionid = event.target.value;
        const action = event.target.id;

        const captions = this.props.captions;
        const caption = captions.filter(caption => caption.caption_id === captionid)[0];
        const previousAcceptState = caption.selected;

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
        this.props.onCaptionUpdate({
            ...caption,
            selected: newAcceptState,
        });
        const data = { 
            operation: 'select', 
            value: newAcceptState, 
        };
        const config = { 
            headers: { 
                'Authorization': `Bearer ${this.props.token}` 
            }
        };
        axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, data, config)
        .catch(error => console.log(error)); 
    }

    render(){
        return (
            <div className="caption-list-container">
                <ul>
                    {
                        this.props.captions.length > 0 ? <li><Header textSize={3} text={`${this.props.captions.length} Caption${this.props.captions.length > 1 ? 's' : ''}`}/></li> 
                        : <li><Header textSize={3} text="Looks like there's nothing here (yet) :("/></li>
                    }
                    { 
                        this.props.captions.map(caption => {
                            return <li key={caption.caption_id}>
                                <Caption 
                                id={caption.caption_id}
                                upvotes={caption.total_votes}
                                username={caption.user.username}
                                date={caption.date_added}
                                caption={caption.caption}
                                selected={caption.selected}
                                token={this.props.token}
                                voteHandler={this.handleVote}
                                acceptHandler={this.handleAccept}/>
                            </li>
                        })                  
                    }
                </ul>    
            </div>
        )
    }
}

export default CaptionList;