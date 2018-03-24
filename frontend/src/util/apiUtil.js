import axios from 'axios';

export const captionRequestTypes = {
    BY_MOMENT: 'BY_MOMENT',
    BY_USER: 'BY_USER',
    BY_MOMENT_AND_USER: 'BY_MOMENT_AND_USER',
}
export const captionFilters = ['Recent', 'Oldest', 'Top', 'Worst', 'Accepted', 'Rejected'];
export const fetchCaptions = ({ token, type, filter, momentId, userId }) => {
    const baseQuery = getRequestTypeQuery(type, momentId, userId);
    const filterQuery = getFilterQuery(filter);
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/captions${baseQuery}${filterQuery}`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
}

export const fetchUser = (username) => {
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/users/${username}`,
    })
    .catch(error => {
        console.log(error)
        throw new Error('nonexistent user');
    });
}

export const fetchUserMoments = (id, token) => {
    const headers = { 
        'Authorization': `Bearer ${token}` 
    };
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/moments?user-id=${id}`,
        header: token ? headers : {}
    });
}

const getRequestTypeQuery = (type, momentId, userId) => {
    const { BY_MOMENT, BY_USER, BY_MOMENT_AND_USER } = captionRequestTypes;
    switch (type) {
        case BY_MOMENT:
            return `?moment-id=${momentId}`;
        case BY_USER:
            return `?user-id=${userId}`;
        case BY_MOMENT_AND_USER:
            return `?moment-id=${momentId}&user-id=${userId}`;
        default:
            return;
    }
}

const getFilterQuery = filter => {
    const [ Recent, Oldest, Top, Worst, Accepted, Rejected ] = captionFilters;
    switch (filter) {
        case Recent:
            return '';
        case Oldest:
            return '&order=asc';
        case Top:
            return '&filter=votes';
        case Worst:
            return '&filter=votes&order=asc';
        case Accepted: 
            return '&filter=acceptance';
        case Rejected:
            return '&filter=acceptance&order=asc';
        default: 
            return;
    }
}
