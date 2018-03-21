import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/Moment.css';

const Moment = props => {
    return (
        <div
          className="Moment-preview-container"
          style={{backgroundImage: `url(http://${process.env.REACT_APP_IP}/res/polaroid_texture.png)`}}>
            <img className="Moment-thumbnail" src={props.image} alt="moment" onClick={props.onClick}/>
            <h1 className="top-caption">{ props.description }</h1>
            <Header textSize={3} text={'Posted on ' + props.date } />
            {
                props.showSubmittedBy && <h1 className="header-medium-2" style={{ marginTop: '8px'}}>
                    Submitted by <Link className="linked-username" to={`/user/${props.username}`}>{props.username}</Link>
                </h1>
            }
        </div>
    )
}

export default Moment;
