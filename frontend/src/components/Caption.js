import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import scrollToComponent from 'react-scroll-to-component';

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
            isHighlighted: false,
            token: props.token,
            showAuthModal: false,
        }
    }
    
    componentDidMount = () => this.scrollToCaption();

    componentDidUpdate = () => {
        const captionId = this.state.caption.caption_id;
        const captionRef = this.refs[captionId];
        this.highlightCaption(captionRef);
    }

    onBlur = (event) => {
        const { scrollTo } = this.props;
        const captionId = this.state.caption.caption_id;
        if ((scrollTo === captionId) && scrollTo) {
            this.setState({ isHighlighted: false });
        }
    }

    scrollToCaption = () => {
        const { scrollTo } = this.props;
        const captionId = this.state.caption.caption_id;
        if ((scrollTo === captionId) && scrollTo) {
            const captionRef = this.refs[captionId];
            scrollToComponent(captionRef, {
                offset: -100,
                align: 'top',
                duration: 1000
            });
            this.setState({ isHighlighted: true });
        }
    }

    highlightCaption = (caption) => {
        caption.focus(); 
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
                className={acceptorClasses[caption.selected + 1]}
                ref={caption.caption_id}
                onBlur={this.onBlur}
                tabIndex={isHighlighted? "0" : null}>
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
