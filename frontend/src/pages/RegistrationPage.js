import React, { Component } from 'react';

class RegistrationPage extends Component{
    render() {
      return (
        <ul>
            <h1>Registration</h1>

            <label for="userid">Username: </label>
            <input type="text" name="username" size="12" />
            
            <label for="passid"> Password: </label>
            <input type="password" name="passid" size="12" />

            <input type="button" onclick="location.href='http://google.com';" value="Register" />
        </ul>
      );
    }
  }
  
  export default RegistrationPage;