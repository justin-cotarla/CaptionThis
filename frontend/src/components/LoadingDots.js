import React, { Component } from 'react';
import '../styles/LoadingDots.css';

class LoadingDots extends Component {
    render() {
        return (
            <div>
                <ul className='loader-holder'>
                    <li className='first-dot-holder'><div id="one" className='dot'></div></li>
                    <li className='dot-holder'><div id="two" className='dot'></div></li>
                    <li className='dot-holder'><div id="three" className='dot'></div></li> 
                </ul>
            </div>
        )
    }   
}

export default LoadingDots;
