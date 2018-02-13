import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import MomentCreation from './pages/MomentCreation';
import MomentViewPage from './pages/MomentViewPage';

import './App.css';

class App extends Component {
  render() {
    return ( 
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route path="/register" component={RegistrationPage}/>
                <Route path="/submit" component={MomentCreation}/>
                <Route path="/momentview/:momentid" component={MomentViewPage}/>
            </Switch> 
        </BrowserRouter>    
    );
  }
}

export default App;
