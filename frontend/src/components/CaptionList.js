import React from 'react';
import axios from 'axios';

import Caption from './Caption';
import Header from './Header';

import '../styles/CaptionList.css';

const CaptionList = (props) => {
    const token = props.token;
    return (
        <div className="caption-list-container">
            <ul>
                { props.children }
                { 
                    props.captions.map(caption => {
                        return <li key={caption.caption_id}>
                            <Caption caption={caption} token={token} />
                        </li>
                    })                  
                }
            </ul>    
        </div>
    )
}

export default CaptionList;