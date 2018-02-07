import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import Moment from './components/Moment';
import sample from './resources/sample-moment.jpg';
//import Moment from './components/Moment'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Moment Description={"Find me a cool caption!"} Image={sample} Date={"06/02/2018"}/>, document.getElementById('root')
);
registerServiceWorker();

