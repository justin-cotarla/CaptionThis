import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import Cookies from 'universal-cookie';
import axios from 'axios';

import '../styles/LoginModal.css';

class LoginModal extends React.Component {
    constructor(props){
        super(props);
        this.state = this.initializeForm();
    }

    initializeForm = () => ({
        fields: {
            username: '',
            password: '',
            verify: '',
        },
        errors: {
            loginError: '',
            userError: '',
            passError: '',
            verifyError: '',
        },
        showRegisterForm: false,
        isWorking: false,
        redirect: null,
    });

    onInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        const { fields } = this.state;
        fields[name] = value;
        this.setState({ fields });
        this.validateInput(name, value);
    }

    onBlur = (event, field) => {
        const { username, password, verify } = this.state.fields;
        let value;
        switch (field) {
            case 'username':
                value = username;
                break;
            case 'password':
                value = password;
                break;
            case 'verify':
                value = verify;
                break;
            default: break;
        }

        this.validateInput(field, value);
    }

    validateInput = (name, value) => {
        const { password } = this.state.fields;
        const { errors, showRegisterForm } = this.state;
        if (showRegisterForm) {
            switch (name) {
                case 'username':
                    if (value === '') errors.userError = 'Username cannot be empty.'
                    else errors.userError = '';
                    break;
                case 'password':
                    if (value === '') errors.passError = 'Password cannot be empty.';
                    else errors.passError = ''
                    break;
                case 'verify':
                    if (value === '') errors.verifyError = 'Please confirm your password.';
                    else if (value !== password) errors.verifyError = 'The passwords do not match!';
                    else if (value === password) errors.verifyError = ''
                    break;
                default: break;
            }
            this.setState({ errors });
        }
    }

    onEnterPress = (event) => {
        const { keyCode, shiftKey } = event;
        if(keyCode === 13 && shiftKey === false) {
          this.onSubmit(event);
        }
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { showRegisterForm } = this.state;
        const { username, password } = this.state.fields;
        this.setState({ isWorking: true });
        if (showRegisterForm) {
            axios({
                url: `http://${process.env.REACT_APP_IP}/api/auth/register`,
                method: 'post',
                data: {
                    username,
                    password,
                },
            })
            .then(({ data }) => {
                if (data.code === 1) {
                    const cookies = new Cookies();
                    cookies.set('token', data.token);
                    this.setState({ redirect: '/' });
                } else {
                    console.log(data);
                }
            });
        } else if (!showRegisterForm) {
            axios({
                url: `http://${process.env.REACT_APP_IP}/api/auth/login`,
                method: 'post',
                data: {
                    username,
                    password,
                },
            })
            .then(({ data }) => {
                if (data.code === 1) {
                    const { token } = data;
                    const cookies = new Cookies();
                    cookies.set('token', token);
                    window.location.reload();
                } else {
                    console.log(data);
                }
            })
            .catch(error => {
                const { errors } = this.state;
                errors.loginError = 'Incorrect username or password!';
                this.setState({
                    errors,
                    isWorking: false,
                });
            });
        }
    }

    showRegisterForm = () => {
        const showRegisterForm = this.state.showRegisterForm;
        this.setState({ 
            ...this.initializeForm(),
            showRegisterForm: !showRegisterForm,
        });
    }

    onClose = () => {
        this.props.onClose();
        setTimeout(() => {
            this.setState(this.initializeForm());
        }, 1000);
    }

    render(){
        const { showRegisterForm, isWorking, redirect } = this.state; 
        const { username, password, verify } = this.state.fields;
        const { loginError, userError, passError, verifyError } = this.state.errors;
        
        const errorIndicator = {
            borderBottom: '2px solid #ff0000',
        };

        let formValid;
        if (showRegisterForm) {
            formValid = username.length > 0 && password.length > 0 && verify.length > 0 && userError.concat(passError, verifyError).length === 0;
        } else {
            formValid = username.length > 0 && password.length > 0 && userError.concat(passError).length === 0;
        }

        return (
            <Modal 
                open={this.props.open} 
                showCloseIcon={true}
                closeOnEsc={true}
                onClose={this.onClose}
                classNames={{ overlay: 'modal-overlay', modal: 'modal-container' }} 
                little>
                {
                    redirect && <Redirect to={redirect}/>
                }
                <h1 className="modal-header">{ showRegisterForm ? 'Sign up for CaptionThis' : 'Log in to your account' }</h1>
                <form className="modal-login-form" onSubmit={this.onSubmit}>
                    <label className="modal-input-label">Username</label>
                    <input 
                        className="modal-input-field" 
                        type="text"  
                        name="username" 
                        value={username} 
                        onChange={this.onInputChange}   
                        style={ (userError || loginError) ? errorIndicator : {} }/>
                    {
                        userError && <h1 className="modal-verify-error">{userError}</h1>
                    }
                    <label className="modal-input-label">Password</label>
                    <input 
                        className="modal-input-field" 
                        name="password"
                        type="password" 
                        value={password} 
                        onChange={this.onInputChange}                             
                        onKeyDown={this.onEnterPress}
                        style={ (passError || loginError) ? errorIndicator : {} }/>
                    {
                        (passError || loginError) && <h1 className="modal-verify-error">{passError || loginError}</h1>
                    }
                    {
                        showRegisterForm && <label className="modal-input-label">Confirm Password</label>
                    }
                    { 
                        showRegisterForm && <input 
                        className="modal-input-field" 
                        type="password"
                        name="verify"
                        value={verify} 
                        onChange={this.onInputChange}
                        onKeyDown={this.onEnterPress}
                        style={ verifyError ? errorIndicator : {} }/>
                    }
                    { 
                        showRegisterForm && verifyError && <h1 className="modal-verify-error">{verifyError}</h1> 
                    } 
                    <button className="modal-login-btn" disabled={!formValid}>
                        { showRegisterForm ? 'Create My Account!' : 'Log In' }
                    </button>
                    {
                        isWorking && <span>working...</span>
                    }
                    <span className="modal-to-login">
                        { showRegisterForm ? 'Already have an account? ' : 'Don\'t have an account? '}
                    </span>
                    <Link to="#" className="modal-to-login" onClick={this.showRegisterForm}>
                        { showRegisterForm ? 'Log in!' : 'Sign up!' }
                    </Link>
                </form>
            </Modal>
        )
    }
};

export default LoginModal;
