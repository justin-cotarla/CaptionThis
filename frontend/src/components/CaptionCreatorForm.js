import React from 'react';
import axios from 'axios';

import LoginModal from './LoginModal';

import '../styles/CaptionCreatorForm.css';

class CaptionCreatorForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caption: '',
            showLoginModal: false,
        }
    }

    handleChange = (event) => {
        const caption = event.target.value;
        this.setState({ caption });
        event.preventDefault();
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
            .then(() => this.props.onCaptionSubmit(momentId))
            .catch(error => {
                console.log(error);
            });
            this.setState({ caption: '' });
        } else {
            this.setState({ showLoginModal: true });
        }      
    }

    render(){
        const token = this.props.token;
        const { caption, showLoginModal } = this.state;
        return (
            <div>
                <LoginModal
                        open={showLoginModal}
                        onClose={(context) => {
                            this.setState({ showLoginModal: false });
                        }}/>
                <form className="caption-creator-form" onSubmit={this.onSubmit}>
                    <input 
                        className="caption-creator-input" 
                        type="text" value={caption} 
                        disabled={!token} 
                        placeholder="Write something good..." 
                        onChange={this.handleChange}/>
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