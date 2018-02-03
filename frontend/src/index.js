import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Moment from './components/Moment'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Moment />, document.getElementById('root'));
registerServiceWorker();
