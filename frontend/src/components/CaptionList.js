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
                {
                    props.captions.length > 0 ? <li><Header textSize={3} text={`${props.captions.length} Caption${props.captions.length > 1 ? 's' : ''}`}/></li> 
                    : <li><Header textSize={3} text="Looks like there's nothing here (yet) :("/></li>
                }
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