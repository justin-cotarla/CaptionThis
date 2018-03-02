import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import '../styles/CreateMoment.css';
import Header from '../components/Header';

class MomentCreation extends Component {
    constructor() {
        super();

        this.state = {
            redirect: null,
        }
    }

    componentDidMount() {
        const cookies = new Cookies();
        const token = cookies.get('token');
        if(token) {
            this.setState({
                token: cookies.get('token'),
            });
        } else {
            this.setState({
                redirect: '/',
            })
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch(`http://${process.env.REACT_APP_IP}/api/moments`, {
            method: 'PUT',
            body: data,
            // Hardcoded to user 'test'
            headers: {'Authorization': `Bearer ${this.state.token}`}
        });
        this.setState({redirect: '/'});
    }
    render(){
        return(
            <div className = "CreateMoment">
                {this.state.redirect && <Redirect to={this.state.redirect} />}
                <form onSubmit={this.handleSubmit} encType="multipart/form-data" noValidate>
                    <div className = "content-container">
                        <Header textSize={2} text="Title" />
                        <input name="title" type="text" className="title" required/>
                    </div>
                    <div className = "content-container">
                        <input type="file" name="file" required></input>
                    </div>
                    <div className = "content-container">
                        <Header textSize={2} text="Description" />
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
