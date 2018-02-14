import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/CreateMoment.css';

class MomentCreation extends Component {

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            redirect: false,
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch(`http://${process.env.REACT_APP_IP}:16085/api/moments/`, {
            method: 'PUT',
            body: data,
            // Hardcoded to user 'test'
            headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNTE4NTc3NTk3LCJleHAiOjE1MTkxODIzOTd9.d5I5aLFSw2_YYTimTB7hny-i664E7tgBYgHa9hnQ110'}
        });
        this.setState({redirect: true});
    }
    render(){
        if (this.state.redirect) {
            return <Redirect to={"/"} />; 
        }
        return(
            <div className = "CreateMoment">
                <form onSubmit={this.handleSubmit} encType="multipart/form-data" noValidate>
                    <div className = "content-container">
                        <label className="label">Title</label>
                        <input name="title" type="text" className="title" required/>
                    </div>
                    <div className = "content-container">
                        <input type="file" name="file" required></input>
                    </div>
                    <div className = "content-container">
                        <label className="label">Description</label>
                        <textarea name="description" rows="8" cols="90"></textarea>
                    </div>
                    <div className = "content-container">
                        <input type="submit" className="button"></input>
                    </div>
                </form>
            </div>
        );
    }
}
  
export default MomentCreation;
