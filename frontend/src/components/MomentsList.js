import React from 'react';
import MomentPreview from './MomentPreview';
import '../styles/MomentsList.css';

const MomentsList = props => {
    return (
        <ul className="Moments-list">
            {
                props.Moments && props.Moments.map(moment => {
                    return (
                        <li key={moment.moment_id}>
                            <MomentPreview Image={ moment.img } Date={ formatDate(moment.date_added) } Description={ moment.description } User={ moment.user_id }/>
                        </li>
                    )
                })
            }
        </ul>
    )
}

// Exact formatting of date will be handled later
const formatDate = date => {
    return date.split('T')[0];
}

export default MomentsList;
