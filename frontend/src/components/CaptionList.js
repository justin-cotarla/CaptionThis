import React from 'react';
import { Link } from 'react-router-dom';
import Caption from './Caption';
import '../styles/CaptionList.css';

const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;

const CaptionList = (props) => {
    const token = props.token;
    return (
        <div className="caption-list-container">
            { props.children }
            <ul>
                { 
                    props.captions.map(caption => {
                        return <li key={caption.caption_id} style={props.linkedToMoment ? {cursor: 'pointer'} : {}}>
                            <ConditionalWrap
                                condition={props.linkedToMoment}
                                wrap={children => <Link className="linked-caption" to={`/moment/${caption.moment_id}`}>{children}</Link>}
                            >
                                <Caption caption={caption} token={token} />
                            </ConditionalWrap>
                        </li>
                    })                  
                }
            </ul>    
        </div>
    )
}

export default CaptionList;