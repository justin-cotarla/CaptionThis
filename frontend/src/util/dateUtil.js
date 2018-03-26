import React from 'react';
import moment from 'moment';
import TimeAgo from 'react-timeago';

const formatter = (value, unit, suffix) => {
    switch (value) {
        case 0:
            return 'just now';
        case 1:
            return `a ${unit} ${suffix}`;
        default: 
            break;
    }
    if (value !== 1) {
        unit += 's';
    } 
    return `${value} ${unit} ${suffix}`;
}

export const timeAgo = dateString => {
    const date = moment(dateString).subtract(4, 'hours').toLocaleString();
    return <TimeAgo date={date} live={true} minPeriod={60} formatter={formatter}/>;
}
