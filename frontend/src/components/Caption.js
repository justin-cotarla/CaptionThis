import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';

import Header from './Header';
import LoadingDots from './LoadingDots';
import CaptionVotes from './CaptionVotes';
import Acceptor from './Acceptor';
import AuthModal from './AuthModal';

import '../styles/CaptionEditor.css';
import '../styles/Caption.css';

import { timeAgo } from '../util/dateUtil';
import { editCaption } from '../util/apiUtil';

class Caption extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caption: props.caption,
            isHighlighted: props.scrollTo === props.caption.caption_id,
            isEditable: false,
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
        this.setState({ isEditable: true });
    }

    onSave = (editedCaption) => {
        this.setState(prevState => {
            return {
                ...prevState,
                isEditable: false,
                caption: {
                    ...prevState.caption,
                    caption: editedCaption,
                },
            }
        });
    }

    render(){
        const { caption, isHighlighted, isEditable, token, showAuthModal } = this.state;
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
                        { 
                            this.props.canEdit && !isEditable
                            && <Link 
                                className="edit-caption"
                                to="#"
                                onClick={this.onEditClick}>
                                    edit
                                </Link>
                        }
                        {
                            isEditable ? 
                                <CaptionEditor 
                                    token={token} 
                                    captionId={caption.caption_id}
                                    caption={caption.caption} 
                                    onSave={this.onSave}
                                    onCancel={() => this.setState({ isEditable: false })}/> : <Header textSize={4} text={caption.caption}/>
                        }
                        {
                            this.props.showSubmittedBy && <h1 style={{ fontSize: '16px' }}>
                                Submitted {timeAgo(caption.date_added)} by <Link className="linked-username" to={`/user/${caption.user.username}`}>{caption.user.username}</Link>
                            </h1>
                        }
                        {
                            !this.props.showSubmittedBy && <h1 style={{ fontSize: '16px' }}>Posted {timeAgo(caption.date_added)}</h1>
                        }
                    </li>
                </ul>
            </div>
        )
    }
}

class CaptionEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentCaption: props.caption,
            editedCaption: props.caption,
            token: props.token,
            isEditing: false,
            error: '',
        }
    }

    onEdit = event => {
        event.preventDefault();
        const editedCaption = event.target.value;
        this.setState({ editedCaption });
    }

    onSave = event => {
        event.preventDefault();
        const { token, editedCaption } = this.state;
        const { captionId } = this.props;
        this.setState({ isEditing: true });
        editCaption({ token, captionId, editedCaption })
        .then(() => this.props.onSave(editedCaption))
        .catch(error => {
            console.log(error)
            this.setState({ 
                isEditing: false,
                error: 'There was a problem editing your caption. Please try again',
            });
        });
    }

    onCancel = event => {
        event.preventDefault();
        this.props.onCancel();
    }

    render() {
        const { token, currentCaption, editedCaption, isEditing, error } = this.state;
        return (
                <div>
                    <textarea
                        className="caption-editor-input" 
                        type="text"
                        value={editedCaption}
                        onChange={this.onEdit}/>
                    { error && <h1 style={{ color: '#ff5e56', fontWeight: 200, fontSize: '16px', marginTop: '0.2em' }}>{error}</h1> }
                    <button 
                        className="caption-editor-btn" 
                        style={{ marginRight: '0.5em'}}
                        onClick={this.onSave} 
                        disabled={token && (editedCaption.length === 0 || currentCaption === editedCaption)}>Save</button>
                    <button
                        className="caption-editor-btn"
                        onClick={this.onCancel}>
                        Cancel
                    </button>
                    { isEditing && <div className="is-editing">
                            <LoadingDots/>
                        </div> }
                </div>
        )
    }
}

export default Caption;
