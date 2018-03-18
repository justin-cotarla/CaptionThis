import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import NavBar from '../components/NavBar';

import '../styles/CreateMoment.css';
import Header from '../components/Header';



class MomentCreation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null,
            user: props.user,
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

    handleChange = (event) => {
        console.log(event.target.files[0].name);
        const filename = event.target.files[0].name;
        document.getElementById('filename').innerHTML = filename;
    }

    render(){
        return(
            <div>
                <NavBar user={this.state.user}/>
                <div className = "createMoment-header">
                <img
                    alt="UploadMoment"
                    src={`http://${process.env.REACT_APP_IP}/res/uploadMoment.png`}
                />
                </div>

                <div className = "CreateMoment">
                    {this.state.redirect && <Redirect to={this.state.redirect} />}
                    <form onSubmit={this.handleSubmit} encType="multipart/form-data" noValidate>

                        <div className = "content-container">

                        <input type="file" name="file" id="file" className="inputfile" onChange={this.handleChange} required/>
                            <label for="file">Choose Moment
                                <img
                                    alt="inputFile"
                                    src={`http://${process.env.REACT_APP_IP}/res/inputfile.png`}
                                />
                            </label>
                            <div id="filename"></div>
                        </div>
                        <div className = "content-container">
                            <div className = "createMoment-description">
                              Description
                            </div>
                            <div className="Wrapper">

                                <div className="Input">
                                    <textarea type="text" id="input" name="description" className="Input-text" row="4" cols="50" placeholder="Add a Description to your Moment"/>
                                    <label for="input" className="Input-label">This will help users come up with your ideal caption!</label>
                                </div>
                            </div>

                        </div>
                        <div className = "content-container">
                            <input type="submit" className="button">
                            </input>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default MomentCreation;
