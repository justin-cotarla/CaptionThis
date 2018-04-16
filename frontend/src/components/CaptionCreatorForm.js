import React from 'react';
import axios from 'axios';

import AuthModal from './AuthModal';

import '../styles/CaptionCreatorForm.css';

class CaptionCreatorForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caption: '',
            showAuthModal: false,
        }
    }

    handleChange = (event) => {
        const caption = event.target.value;
        this.setState({ caption });
        event.preventDefault();
    }

    onEnterPress = (event) => {
        const { keyCode, shiftKey } = event;
        if(keyCode === 13 && shiftKey === false) {
          this.onSubmit(event);
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        const token = this.props.token;

        if(token){
            const momentId = this.props.momentId;
            const caption = this.state.caption;

            const data = { 
                content: caption, 
                momentId: momentId,
            };
            const headers = { 
                'Authorization': `Bearer ${token}` 
            };

            axios({
                method: 'put',
                url: `http://${process.env.REACT_APP_IP}/api/captions`,
                data: data,
                headers: token ? headers : {}
            })
            .then(() => this.props.onCaptionSubmit())
            .catch(error => {
                console.log(error);
            });
            this.setState({ caption: '' });
        } else {
            this.setState({ showAuthModal: true });
        }      
    }

    render(){
        const token = this.props.token;
        const { caption, showAuthModal } = this.state;
        return (
            <div>
                <AuthModal
                        open={showAuthModal}
                        onClose={(context) => {
                            this.setState({ showAuthModal: false });
                        }}/>
                <form className="caption-creator-form" onSubmit={this.onSubmit}>
                    <textarea 
                        className="caption-creator-input" 
                        type="text" value={caption} 
                        disabled={!token} 
                        placeholder="Write something good..." 
                        onChange={this.handleChange}
                        onKeyDown={this.onEnterPress}/>
                    <button 
                        className="caption-creator-submit" 
                        type="submit" 
                        disabled={token && caption.length === 0}>{ token ? 'Submit' : 'Login to submit a caption'}</button>
                </form>
            </div>
        )
    }

}

export default CaptionCreatorForm;