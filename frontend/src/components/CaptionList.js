import React from 'react';
import { Link } from 'react-router-dom';

import Caption from './Caption';
import '../styles/CaptionList.css';

const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;

const CaptionList = props => {   
    const { user, captions, momentCreatorId, showSubmittedBy, isLinkedToMoment, token } = props;
    return (
        <div className="caption-list-container">
            { props.children }
            <ul>
                { 
                    captions.map(caption => {
                        return <li key={caption.caption_id} style={isLinkedToMoment ? {cursor: 'pointer'} : {}}>
                                <ConditionalWrap
                                    condition={isLinkedToMoment}
                                    wrap={children => <Link className="linked-caption" to={{pathname: `/moment/${caption.moment_id}`, state: { scrollTo: caption.caption_id}}}>{children}</Link>}>
                                    <Caption 
                                        scrollTo={props.scrollTo}
                                        caption={caption} 
                                        showSubmittedBy={showSubmittedBy}
                                        canAccept={
                                            (user) // The user is logged on
                                            && (momentCreatorId === user.id) // The logged-on user created the moment
                                            && (user.id !== caption.user.user_id) // The logged-on user did not create the caption
                                        } 
                                        token={token} />
                                </ConditionalWrap>
                            </li>    
                        })
                    }
            </ul>    
        </div>   
    )
}

export default CaptionList;
