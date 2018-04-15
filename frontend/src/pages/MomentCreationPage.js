import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { uploadMoment } from '../util/ApiUtil';
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
            file: null,
            filename: '',
            isUploading: false,
            fileError: null,
        }
    }

    componentDidMount() {
        if(!this.props.token) {
            this.setState({
                redirect: '/',
            })
        }        
    }

    onSubmit = (event) => {
        event.preventDefault();
        
        this.setState({ isUploading: true });
        uploadMoment({
            token: this.props.token,
            file: this.state.file,
            description: this.state.description,
        })
            .then(() => {
                this.setState({ redirect: '/' });
            })
            .catch(error => {                
                this.setState({
                    uploadError: 'Could not upload image',
                    isUploading: false,
                })
            });
    }

    onFileChange = (event) => {
        const file = event.target.files[0];

        let filename = file.name;
        if (filename.length > 10) {
            filename = filename.slice(0, 11).concat('...');
        }

        if (file.size > 10 * 1000 * 1000) {
            this.setState({
                fileError: 'The picture you selected is too large!',
                filename,
            });
            return;
        }

        this.setState({ 
            file,
            filename,
            fileError: null,
        });
        this.refs.fileInput.blur();
    }

    onDescriptionChange = (event) => {
        const description = event.target.value;
        this.setState({ description });
    }

    onClear = () => {
        this.refs.fileInput.value = null;
        this.setState({
            description: '', 
            filename: '',
            file: null,
            fileError: null,
        }); 
    }

    render(){
        return(
            <div>
                <NavBar user={this.state.user}/>
                <div className="create-moment-container">
                    <img
                        className="upload-moment-banner"
                        alt="UploadMoment"
                        src={`http://${process.env.REACT_APP_IP}/res/uploadyourmoment.png`}
                    />
                    {this.state.redirect && <Redirect to={this.state.redirect} />}
                    <form className="moment-create-form" onSubmit={this.onSubmit} encType="multipart/form-data" noValidate>
                        <label className="moment-create-label">Upload</label>
                        <h1 className = "moment-file-hint">
                            Upload a picture (up to 10mb).
                        </h1>
                        <input 
                            type="file" 
                            name="file" 
                            ref="fileInput" 
                            id="file" 
                            className="inputfile" 
                            onChange={this.onFileChange} 
                            accept="image/*" required/>
                        <label 
                            htmlFor="file"
                            className="upload-button">
                            { this.state.filename ? this.state.filename : 'Select Image' }
                            <img alt="inputFile" src={`http://${process.env.REACT_APP_IP}/res/uploadicon.png`}/>
                        </label>
                        {
                            this.state.fileError && <h1 className="file-error">{this.state.fileError}</h1>
                        }
                        <label className="moment-create-label">Description</label>
                        <h1 className="moment-desc-hint">
                            Provide context to help others come up with the ideal caption!
                        </h1>
                        <textarea 
                            value={this.state.description} 
                            onChange={this.onDescriptionChange} 
                            type="text" 
                            id="input" 
                            name="description" 
                            className="desc-textarea"/>
                        <input
                            type="submit"
                            className="moment-create-button"
                            disabled={this.state.isUploading || this.state.fileError}
                        />
                        <input 
                            type="reset" 
                            className="moment-create-button" 
                            value="Clear" 
                            style={{marginLeft: '10px'}}
                            onClick={this.onClear}
                            disabled={this.state.isUploading}/>
                    </form>
                    { 
                        this.state.isUploading 
                        && <div className="moment-uploading-dots">
                                <LoadingDots/> 
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default MomentCreation;
