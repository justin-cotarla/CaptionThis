import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../util/DateUtil';
import { Redirect } from 'react-router';
import ConditionalWrap from './ConditionalWrap';
import DeleteModal from './DeleteModal';
import '../styles/Moment.css';
import { editMoment } from '../util/ApiUtil';
import LoadingDots from './LoadingDots';

class Moment extends Component {
    constructor(props){
        super(props);
        this.state = {
            description: props.description,
            toHome: false,
            showAuthModal: false,
            showDeleteModal: false,
            editing: false,
            editor: {
                newDesc: props.description,
                isEditing: false,
                editError: '',
            },
            token: props.token,
        };

    };

    deleteMoment = () => {
        this.setState({
            showDeleteModal: true,
        });
    }

    onEditClick = event => {
        event.preventDefault();
        this.setState({ editing: true });
    }

    onEdit = event => {
        event.preventDefault();
        const newDescription = event.target.value;
        const { editor } = this.state;
        editor.newDesc = newDescription;
        this.setState({ editor });
    }

    onCancelEdit = () => {
        const { editor } = this.state;
        editor.newDesc = this.state.description;
        this.setState({
            editor,
            editing: false,
        });
    }

    onSave = event => {
        event.preventDefault();
        const { token, editor } = this.state;
        const { newDesc } = editor;
        const momentId = this.props.momentId;

        editor.isEditing = true;
        this.setState({ editor });

        editMoment({ token, momentId, newDesc })
        .then(() => {
            editor.isEditing = false;
            this.setState(prevState => {
                return {
                    ...prevState,
                    editing: false,
                    editor,
                    description: newDesc,
                }
            });
        })
        .catch(error => {
            editor.isEditing = false;
            editor.editError = 'There was a problem editing your moment...';
            this.setState({ editor });
        });
    }

    render() {
        const props = this.props;
        const { editing, token } = this.state;
        const { newDesc, isEditing, editError } = this.state.editor;
        return (
            <div
            className="Moment-preview-container"
            style={{backgroundImage: `url(http://${process.env.REACT_APP_IP}/res/polaroid_texture.png)`}}>
            <DeleteModal
                    open={this.state.showDeleteModal}
                    token={this.props.token}
                    momentId={this.props.momentId}
                    onClose={() => this.setState({ showDeleteModal: false })}/>
            {this.state.toHome && <Redirect to={'/'} />}
            { (props.currentUser ? props.currentUser.username === props.user.username : false) && <h1 className="delete-button" onClick={this.deleteMoment}>X</h1> }
            {
                (props.currentUser ? props.currentUser.username === props.user.username : false) &&
                !editing &&
                props.editable &&
                <img
                    className="edit-button"
                    src={`http://${process.env.REACT_APP_IP}/res/edit.png`}
                    alt="edit"
                    onClick={this.onEditClick}
                />
            }
                <ConditionalWrap
                    condition={this.props.momentId}
                    wrap={children =>  <Link to={`/moment/${props.momentId}`}>{children}</Link>}
                >
                    <img className="Moment-thumbnail" src={props.image} alt="moment"/>
                    {
                        editing ?
                        <div className="moment-editor-container">
                            <textarea
                                ref={(textarea) => this.Textarea = textarea}
                                className="moment-editor-input"
                                type="text"
                                value={newDesc}
                                onChange={this.onEdit}/>
                            {
                                editError && <h1 className="edit-error">{editError}</h1>
                            }
                            <button
                                className="moment-editor-btn"
                                style={{ marginRight: '0.5em'}}
                                onClick={this.onSave}
                                disabled={((token) && (newDesc.length === 0 || props.description === newDesc)) || isEditing}>Save</button>
                            <button
                                className="moment-editor-btn"
                                onClick={this.onCancelEdit}
                                disabled={isEditing}>
                                Cancel
                            </button>
                            {
                                isEditing && <div className="is-editing"><LoadingDots/></div>
                            }
                        </div>
                        : <h1 className="top-caption">{ this.state.description }</h1>
                    }
                </ConditionalWrap>
                    <h1 style={{fontSize: '20px'}}>Posted {timeAgo(props.date)}</h1>
                    {
                        this.props.showSubmittedBy && <h1 className="header-medium-2" style={{ marginTop: '8px'}}>
                            Submitted by <ConditionalWrap
                                        condition={props.user.id !== null}
                                        wrap={children => <Link className="linked-username" to={`/user/${props.user.username}`}>{children}</Link>}
                                    >
                                {(props.user.id === null) ? '[deleted]' : props.user.username}
                            </ConditionalWrap>
                        </h1>
                    }
            </div>
        )
    }
}

export default Moment;
