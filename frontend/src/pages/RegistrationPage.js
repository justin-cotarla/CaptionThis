import React, { Component } from 'react';

class RegistrationPage extends Component{
    render() {
      return (
        <ul>
            <h1>Sign Up</h1>

            <label for="userid">Username: </label>
            <input type="text" name="username" size="12" />
            
            <label for="passid"> Password: </label>
            <input type="password" name="passid" size="12" />

            <input type="button" onclick="Redirect to sign up" value="Sign Up" />

            <li><label for="loginMessage">If you already have an account, please login: </label>
            <input type="button" onclick="Login" value="Login" /></li>
        </ul>
      );
    }
  }
  
  export default RegistrationPage;