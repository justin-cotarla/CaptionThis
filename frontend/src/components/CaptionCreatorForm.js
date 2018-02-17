import React from 'react';
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
        this.props.handleSubmit(this.state.caption);
        this.setState({ caption: '' });
    }

    render(){
        return (
            <form className="caption-creator-form" onSubmit={this.onSubmit}>
                <input className="caption-creator-input" type="text" value={this.state.caption} placeholder="Write something good..." onChange={this.handleChange}/>
                <button className="caption-creator-submit" type="submit" disabled={!this.state.caption}>{this.props.authorized}</button>
            </form>
        )
    }

}

export default CaptionCreatorForm;