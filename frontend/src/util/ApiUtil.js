import axios from 'axios';

export const RequestTypes = {
    BY_MOMENT: 'BY_MOMENT',
    BY_USER: 'BY_USER',
    BY_MOMENT_AND_USER: 'BY_MOMENT_AND_USER',
}

export const momentFilters = [
    'Recent',
    'Oldest',
    'Popular'
];

export const captionFilters = [
    'Recent',
    'Oldest',
    'Top',
    'Worst',
    'Accepted',
    'Rejected'
];

export const uploadMoment = ({ token, file, description }) => {
    const data = new FormData();
    data.append('file', file);
    data.append('description', description);
    
    return axios({
        method: 'put',
        url: `http://${process.env.REACT_APP_IP}/api/moments`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
        data,
    })
}

export const fetchMoments = ({ token, type, filter, userId, start, range }) => {
    const baseParams = getRequestTypeQuery(type, null, userId);
    const filterParams = getMomentsFilterQuery(filter);
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/moments`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        params: { ...baseParams, ...filterParams, start, range },
    });
}

export const fetchCaptions = ({ token, type, filter, momentId, userId, start, range }) => {
    const baseParams = getRequestTypeQuery(type, momentId, userId);
    const filterParams = getCaptionFilterQuery(filter);
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/captions`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        params: {  ...baseParams, ...filterParams, start, range }
    });
}

export const deleteMoment = ({ token, momentId }) => {
    return axios({
        method: 'DELETE',
        url: `http://${process.env.REACT_APP_IP}/api/moment/${momentId}`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
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

const getRequestTypeQuery = (type, momentId, userId) => {
    const { BY_MOMENT, BY_USER, BY_MOMENT_AND_USER } = RequestTypes;
    switch (type) {
        case BY_MOMENT:
            return { 'moment-id': momentId };
        case BY_USER:
            return { 'user-id': userId };
        case BY_MOMENT_AND_USER:
            return { 'moment-id': momentId, 'user-id': userId };
        default:
            return {};
    }
}

const getMomentsFilterQuery = filter => {
    const [ Recent, Oldest, Popular ] = momentFilters;
    switch (filter) {
        case Recent:
            return {};
        case Oldest:
            return { order: 'asc' };
        case Popular:
            return { filter: 'popularity' };
        default:
            return {};
    }
}

const getCaptionFilterQuery = filter => {
    const [ Recent, Oldest, Top, Worst, Accepted, Rejected ] = captionFilters;
    switch (filter) {
        case Recent:
            return {};
        case Oldest:
            return { order: 'asc' };
        case Top:
            return { filter: 'votes' };
        case Worst:
            return { filter: 'votes', order: 'asc' };
        case Accepted:
            return { filter: 'acceptance' };
        case Rejected:
            return { filter: 'acceptance', order: 'asc' };
        default:
            return {};
    }
}

export const editCaption = ({ token, captionId, newCaption }) => {
    const data = {
        operation: 'edit',
        value: newCaption,
    };
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    return axios({
        method: 'post',
        url: `http://${process.env.REACT_APP_IP}/api/captions/${captionId}`,
        data,
        headers,
    });
}

export const editMoment = ({ token, momentId, newDesc }) => {
    const data = {
        description: newDesc,
    };
    const headers = token ? { 'Authorization': `Bearer ${token}` }: {};
    return axios({
        method: 'POST',
        url: `http://${process.env.REACT_APP_IP}/api/moments/${momentId}`,
        data,
        headers,
    });
}
