import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';

import CaptionEditor from './CaptionEditor';
import CaptionVotes from './CaptionVotes';
import Acceptor from './Acceptor';
import AuthModal from './AuthModal';

import '../styles/CaptionEditor.css';
import '../styles/Caption.css';

import { timeAgo } from '../util/DateUtil';

class Caption extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caption: props.caption,
            isHighlighted: props.scrollTo === props.caption.caption_id,
            editing: false,
            token: props.token,
            showAuthModal: false,
        }
    }

    componentWillReceiveProps = (nextProps) =>{
        if (nextProps.scrollTo !== this.props.caption.caption) {
            this.setState({ isHighlighted: false });
        }
    }

    handleVote = (event) => {
        const token = this.state.token;
        if (token) {    
            const action = event.target.className;
            const UPVOTE = 'vote-ticker-plus';
            const previousVote = this.state.caption.user_vote;

            let newVote;
            switch (previousVote) {
                case 0:
                    newVote = (action === UPVOTE) ? 1 : -1; 
                    break;
                case 1:
                    newVote = (action === UPVOTE) ? 0 : -1;
                    break;
                case -1:
                    newVote = (action === UPVOTE) ? 1 : 0;
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

    onEditClick = event => {
        event.preventDefault();
        this.setState({ editing: true });
    }

    onSave = (newCaption) => {
        this.setState(prevState => {
            return {
                ...prevState,
                editing: false,
                caption: {
                    ...prevState.caption,
                    caption: newCaption,
                },
            }
        });
    }

    render(){
        const { caption, isHighlighted, editing, token, showAuthModal } = this.state;
        const { canEdit } = this.props;
        const acceptorClasses = ["caption-container-rejected", "caption-container", "caption-container-accepted"];
        return (
            <div
                className={classnames(acceptorClasses[caption.selected + 1], isHighlighted ? 'caption-highlighted' : '')}
                ref={caption.caption_id}>
                <AuthModal
                    open={showAuthModal}
                    onClose={() => this.setState({ showAuthModal: false })}/>
                        <CaptionVotes
                            upvotes={caption.total_votes}
                            voteHandler={this.handleVote}
                            id={caption.caption_id}
                            vote_value={this.state.caption.user_vote}/>
                    <div className="caption-content">
                        <Acceptor
                            canAccept={this.props.canAccept}
                            captionId={caption.caption_id}
                            status={caption.selected}
                            acceptHandler={this.handleAccept} />
                        { 
                            canEdit && !editing
                            && <span 
                                className="edit-caption"
                                onClick={this.onEditClick}>
                                    edit
                                </span>
                        }
                        {
                            editing ?
                                <CaptionEditor 
                                    key={caption.caption_id}
                                    token={token} 
                                    captionId={caption.caption_id}
                                    caption={caption.caption} 
                                    onSave={this.onSave}
                                    onCancel={() => this.setState({ editing: false })}/> : <h1 style={{fontSize: '24px'}}>{caption.caption}</h1>
                        }
                        {
                            this.props.showSubmittedBy && <h1 className="caption-submitted-by">
                                Submitted {timeAgo(caption.date_added)} by <Link className="linked-username" to={`/user/${caption.user.username}`}>{caption.user.username}</Link>
                            </h1>
                        }
                        {
                            !this.props.showSubmittedBy && <h1 className="caption-submitted-by">Posted {timeAgo(caption.date_added)}</h1>
                        }
                    </div>
            </div>
        )
    }
}

export default Caption;
