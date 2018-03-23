import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import scrollToComponent from 'react-scroll-to-component';
import classnames from 'classnames';

import Header from './Header';
import CaptionVotes from './CaptionVotes';
import Acceptor from './Acceptor';

import '../styles/Caption.css';
import AuthModal from './AuthModal';

class Caption extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caption: props.caption, 
            isHighlighted: props.scrollTo === props.caption.caption_id,
            token: props.token,
            showAuthModal: false,
        }
    }
    
    componentDidMount = () => {
        const { isHighlighted } = this.state;
        const captionId = this.state.caption.caption_id;
        if (isHighlighted) {
            const captionRef = this.refs[captionId];
            scrollToComponent(captionRef, {
                offset: -100,
                align: 'top',
                duration: 1000
            });
        }
    };

    componentWillReceiveProps(nextProps){
        if(this.state.scrollTo !== nextProps.scrollTo){
            this.setState({ isHighlighted: false })
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
        } else {
            this.setState({ showAuthModal: true });
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
        const { caption, isHighlighted, showAuthModal } = this.state;
        const acceptorClasses = ["caption-container-rejected", "caption-container", "caption-container-accepted"];
        return (
            <div 
                className={classnames(acceptorClasses[caption.selected + 1], isHighlighted ? 'caption-highlighted' : '')}
                ref={caption.caption_id}>
                <AuthModal
                    open={showAuthModal}
                    onClose={() => this.setState({ showAuthModal: false })}/>
                <ul>
                    <li>
                        <CaptionVotes 
                            upvotes={caption.total_votes}
                            voteHandler={this.handleVote} 
                            id={caption.caption_id}
                            vote_value={this.state.caption.user_vote}/>
                    </li>
                    <li className="caption-content">
                        <Acceptor 
                            canAccept={this.props.canAccept} 
                            captionId={caption.caption_id} 
                            status={caption.selected} 
                            acceptHandler={this.handleAccept} />
                        <Header textSize={2} text={caption.caption}/>  
                        {   
                            this.props.showSubmittedBy && <h1 style={{ fontSize: '12px' }}>
                                Submitted by <Link className="linked-username" to={`/user/${caption.user.username}`}>{caption.user.username}</Link> on {caption.date_added}
                            </h1> 
                        }
                        {
                            !this.props.showSubmittedBy && <Header text={`Posted on ${caption.date_added}`}/> 
                        }
                    </li>
                </ul>
            </div>
        )
    }
}

export default Caption;
