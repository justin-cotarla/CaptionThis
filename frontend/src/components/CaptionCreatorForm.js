import React from 'react';
import axios from 'axios';

import '../styles/CaptionCreatorForm.css';

class CaptionCreatorForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caption: '',
        }
    }

    handleChange = (event) => {
        const caption = event.target.value;
        this.setState({ caption });
        event.preventDefault();
    }

    onSubmit = (event) => {
        event.preventDefault();
        const momentId = this.props.momentId;
        const caption = this.state.caption;

        const data = { 
            content: caption, 
            moment_id: momentId,
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${this.props.token}`
            },
        };

        if(this.props.token){
            axios.put(`http://${process.env.REACT_APP_IP}/api/captions`, data, config)
            .then(() => this.props.onCaptionSubmit(momentId))
            .catch(error => {
                console.log(error);
            })
        }   
        this.setState({ caption: '' });
    }

    render(){
        return (
            <form className="caption-creator-form" onSubmit={this.onSubmit}>
                <input className="caption-creator-input" type="text" value={this.state.caption} placeholder="Write something good..." onChange={this.handleChange}/>
                <button className="caption-creator-submit" type="submit" disabled={!this.state.caption}>{ this.props.token ? 'Submit' : 'Login to submit a caption'}</button>
            </form>
        )
    }

}

export default CaptionCreatorForm;