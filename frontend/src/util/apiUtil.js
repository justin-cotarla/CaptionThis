import axios from 'axios';

export const RequestTypes = {
    BY_MOMENT: 'BY_MOMENT',
    BY_USER: 'BY_USER',
    BY_MOMENT_AND_USER: 'BY_MOMENT_AND_USER',
}
export const momentFilters = ['Recent', 'Oldest', 'Popular'];
export const captionFilters = ['Recent', 'Oldest', 'Top', 'Worst', 'Accepted', 'Rejected'];
export const fetchMoments = ({ token, type, filter, userId, limit }) => {
    const baseParams = getRequestTypeQuery(type, null, userId);
    const filterParams = getMomentsFilterQuery(filter, baseParams);
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/moments`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        params: { ...filterParams, limit },
    })
}

export const fetchCaptions = ({ token, type, filter, momentId, userId, limit }) => {
    const baseParams = getRequestTypeQuery(type, momentId, userId);
    const filterParams = getCaptionFilterQuery(filter, baseParams);
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/captions`,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        params: { ...filterParams, limit }
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
            return { 
                'moment-id': momentId, 
                'user-id': userId 
            };
        default:
            return {};
    }
}

const getMomentsFilterQuery = (filter, params) => {
    const [ Recent, Oldest, Popular ] = momentFilters;
    switch (filter) {
        case Recent:
            return { ...params };
        case Oldest:
            return { ...params, order: 'asc' };
        case Popular:
            return { ...params, filter: 'popularity' };
        default:
            return { ...params };
    }
}

const getCaptionFilterQuery = (filter, params) => {
    const [ Recent, Oldest, Top, Worst, Accepted, Rejected ] = captionFilters;
    switch (filter) {
        case Recent:
            return { ...params };
        case Oldest:
            return { ...params, order: 'asc' };
        case Top:
            return { ...params, filter: 'votes' };
        case Worst:
            return { ...params, filter: 'votes', order: 'asc' };
        case Accepted: 
            return { ...params, filter: 'acceptance' };
        case Rejected:
            return { ...params, filter: 'acceptance', order: 'asc' };
        default: 
            return { ...params };
    }
}
