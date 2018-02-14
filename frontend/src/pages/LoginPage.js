import React, { Component } from 'react';
import axios from 'axios';

class LoginPage extends Component{
    render() {
      return (
        <ul>
            <h1>Login</h1>

            <label for="userid">Username: </label>
            <input type="text" name="username" size="12" />
            
            <label for="passid"> Password: </label>
            <input type="password" name="passid" size="12" />

            <input type="button" onclick="Redirect to sign up" value="Login" />
        </ul>
      );
    }
  }
  
  export default LoginPage;