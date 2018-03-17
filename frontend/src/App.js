import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

import AuthRoute from './components/AuthRoute';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import MomentCreationPage from './pages/MomentCreationPage';
import MomentViewPage from './pages/MomentViewPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

import './App.css';

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <Switch>
                <AuthRoute exact path="/" component={LandingPage}/>
                <AuthRoute path="/register" component={RegistrationPage}/>
                <AuthRoute path="/login" component={LoginPage}/>
                <AuthRoute path="/submit" component={MomentCreationPage}/>
                <AuthRoute path="/moment/:momentID" component={MomentViewPage}/>
                <AuthRoute path="/user/:username" component={ProfilePage}/>
            </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
