import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

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
                <Route exact path="/" component={LandingPage}/>
                <Route path="/register" component={RegistrationPage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/submit" component={MomentCreationPage}/>
                <Route path="/moment/:momentID" component={MomentViewPage}/>
                <Route path="/user/:username" component={ProfilePage}/>
            </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
