import React from 'react';
import { captionFilters } from '../util/apiUtil';
import '../styles/CaptionFilter.css';

const CaptionFilter = props => {
    const selectedFilterStyle = {
        color: '#1DE28F',
        borderBottom: '1px solid #1DE28F',
        paddingBottom: '3px',
        transition: 'color 200ms ease-in-out 0s, border-bottom 300ms ease-in-out 0s',
        cursor: 'default',
    }
    return (
        <ul className="caption-filter">
            {
                captionFilters.map(filter => {
                    return <li  key={filter} 
                                style={filter === props.selectedFilter ? selectedFilterStyle : null}
                                onClick={() => props.onFilterChange(filter)}>
                            { filter }
                        </li>
                })
            }
        </ul>
    )
}

export default CaptionFilter;
