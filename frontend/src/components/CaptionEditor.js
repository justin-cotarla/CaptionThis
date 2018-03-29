import React from 'react';
import LoadingDots from './LoadingDots';
import { editCaption } from '../util/ApiUtil';

class CaptionEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentCaption: props.caption,
            newCaption: props.caption,
            token: props.token,
            isEditing: false,
            error: '',
        }
    }

    componentDidMount(){
        const { Textarea } = this;
        Textarea.focus();
    }

    onEdit = event => {
        event.preventDefault();
        const newCaption = event.target.value;
        this.setState({ newCaption });
    }

    onSave = event => {
        event.preventDefault();
        const { token, newCaption } = this.state;
        const { captionId } = this.props;
        this.setState({ isEditing: true });
        editCaption({ token, captionId, newCaption })
        .then(() => this.props.onSave(newCaption))
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
        const { token, currentCaption, newCaption, isEditing, error } = this.state;
        return (
                <div className="caption-editor-container">
                    <textarea
                        ref={(textarea) => this.Textarea = textarea}
                        className="caption-editor-input" 
                        type="text"
                        value={newCaption}
                        onChange={this.onEdit}/>
                    { error && <h1 style={{ color: '#ff5e56', fontWeight: 200, fontSize: '16px', marginTop: '0.2em' }}>{error}</h1> }
                    <button 
                        className="caption-editor-btn" 
                        style={{ marginRight: '0.5em'}}
                        onClick={this.onSave} 
                        disabled={token && (newCaption.length === 0 || currentCaption === newCaption)}>Save</button>
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

export default CaptionEditor;
