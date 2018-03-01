import React from 'react';
import axios from 'axios';

import Caption from './Caption';
import Header from './Header';

import '../styles/CaptionList.css';

class CaptionList extends React.Component {
    handleVote = (event) => {
        const captionid = event.target.value;
        const action = event.target.id;
        const captions = this.props.captions;

        const caption = captions.filter(caption => caption.caption_id === captionid)[0];

        switch(action) {
            case '+': 
                if(caption.user_vote === 0 || caption.user_vote === -1){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: 1 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .then(response => {
                        this.props.onCaptionUpdate({ ...caption, total_votes: response.data.votes, user_vote: 1 })
                    })
                } else if(caption.user_vote === 1) {
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .then(response => {
                        this.props.onCaptionUpdate({ ...caption, total_votes: response.data.votes, user_vote: 0 })
                    })
                }           
            break;
            case '-': 
                if(caption.user_vote === 0 || caption.user_vote === 1){
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: -1 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .then(response => {
                        this.props.onCaptionUpdate({ ...caption, total_votes: response.data.votes, user_vote: -1 })
                    })
                } else if(caption.user_vote === -1){
                    
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'vote', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .then(response => {
                        this.props.onCaptionUpdate({ ...caption, total_votes: response.data.votes, user_vote: 0 })
                    })
                } 
            break;
            default: break;
        }
    }

    handleAccept = (event) => {
        const captionid = event.target.value;
        const action = event.target.id;
        const captions = this.props.captions;

        const caption = captions.filter(caption => caption.caption_id === captionid)[0];

        switch(action) {
            case 'accept': 
                if(caption.selected === -1 || caption.selected === 0){
                    this.props.onCaptionUpdate({ ...caption, selected: 1 })
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: 1 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    this.props.onCaptionUpdate({ ...caption, selected: 0 })
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }  
            break;
            case 'reject': 
                if(caption.selected === 1 || caption.selected === 0){
                    this.props.onCaptionUpdate({ ...caption, selected: -1 });
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: -1 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .catch(error => {
                        console.log(error);
                    });
                } else {
                    this.props.onCaptionUpdate({ ...caption, selected: 0 });
                    axios.post(`http://${process.env.REACT_APP_IP}/api/captions/${captionid}`, { operation: 'select', value: 0 }, {
                        headers: {'Authorization': `Bearer ${this.props.token}`}
                    })
                    .catch(error => {
                        console.log(error);
                    });
                }
            break;
            default: break;
        }
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