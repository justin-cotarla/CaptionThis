import React from 'react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../util/DateUtil';
import ConditionalWrap from './ConditionalWrap';
import '../styles/Moment.css';

const Moment = props => {
    return (
        <div
          className="Moment-preview-container"
          style={{backgroundImage: `url(http://${process.env.REACT_APP_IP}/res/polaroid_texture.png)`}}>
            <ConditionalWrap
                condition={props.momentId}
                wrap={children =>  <Link to={`/moment/${props.momentId}`}>{children}</Link>}
            >
                <img className="Moment-thumbnail" src={props.image} alt="moment" onClick={props.onClick}/>
                <h1 className="top-caption">{ props.description }</h1>
            </ConditionalWrap>
                <h1 style={{fontSize: '20px'}}>Posted {timeAgo(props.date)}</h1>
                {
                    props.showSubmittedBy && <h1 className="header-medium-2" style={{ marginTop: '8px'}}>
                        Submitted by <ConditionalWrap
                                    condition={props.user.id !== null}
                                    wrap={children => <Link className="linked-username" to={`/user/${props.user.username}`}>{children}</Link>}
                                >
                            {(props.user.id === null) ? '[deleted]' : props.user.username}
                        </ConditionalWrap>
                    </h1>
                }
        </div>
    )
}

export default Moment;
