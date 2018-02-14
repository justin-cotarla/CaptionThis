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
        fetch('http://localhost:16085/api/moments/', {
        method: 'PUT',
        body: data,
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
