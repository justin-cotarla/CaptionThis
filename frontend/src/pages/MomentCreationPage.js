import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import NavBar from '../components/NavBar';
import LoadingDots from '../components/LoadingDots';
import '../styles/CreateMoment.css';


class MomentCreation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            user: props.user,
            description: '',
            filename: '',
            isUploading: false,
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
        this.setState({ isUploading: true });
        fetch(`http://${process.env.REACT_APP_IP}/api/moments`, {
            method: 'PUT',
            body: data,
            // Hardcoded to user 'test'
            headers: {'Authorization': `Bearer ${this.state.token}`}
        }).then(() => {
            this.setState({ redirect: '/' });
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleChange = (event) => {
        const image = event.target.files[0];
        if (image) {
            console.log(image.name);
            const filename = event.target.files[0].name;
            this.setState({ filename });
            this.refs.fileInput.blur();
        }
    }

    onDescriptionChange = (event) => {
        const description = event.target.value;
        this.setState({ description });
    }

    onClear = () => {
        this.refs.fileInput.value = null;
        this.setState({
            description: '', 
            filename: ''
        }); 
    }

    render(){
        return(
            <div>
                <NavBar user={this.state.user}/>
                <img
                    className="upload-moment-banner"
                    alt="UploadMoment"
                    src={`http://${process.env.REACT_APP_IP}/res/uploadyourmoment.png`}
                />
                <div className = "CreateMoment">
                    {this.state.redirect && <Redirect to={this.state.redirect} />}
                    <form className="moment-create-form" onSubmit={this.handleSubmit} encType="multipart/form-data" noValidate>
                        <label className = "moment-create-label">Upload</label>
                        <input 
                            type="file" 
                            name="file" 
                            ref="fileInput" 
                            id="file" 
                            className="inputfile" 
                            onChange={this.handleChange} 
                            accept="image/*" required/>
                        <label 
                            htmlFor="file"
                            className="upload-button">
                            Select Image
                            <img alt="inputFile" src={`http://${process.env.REACT_APP_IP}/res/uploadicon.png`}/>
                        </label>
                        <div id="filename">{this.state.filename}</div>
                        <label className = "moment-create-label" style={{top: '15px'}}>Description</label>
                        <h1 className = "moment-desc-hint">
                            Provide context to help others come up with the ideal caption!
                        </h1>
                        <textarea 
                            value={this.state.description} 
                            onChange={this.onDescriptionChange} 
                            type="text" 
                            id="input" 
                            name="description" 
                            className="desc-textarea"/>
                        <input type="submit" className="moment-create-button" disabled={this.state.isUploading}></input>
                        <input 
                            type="reset" 
                            className="moment-create-button" 
                            value="Clear" 
                            style={{marginLeft: '10px'}}
                            onClick={this.onClear}
                            disabled={this.state.isUploading}/>
                        { this.state.isUploading && <LoadingDots/> }
                    </form>
                </div>
            </div>
        );
    }
}

export default MomentCreation;
