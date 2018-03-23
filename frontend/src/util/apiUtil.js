import Cookies from 'universal-cookie';
import axios from 'axios';

export const getToken = () => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    return token;
}

export const fetchCaptionsByMomentId = (momentid, token) => {
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/captions?moment-id=${momentid}`,
        headers: token ? headers : {}
    })
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

export const fetchUserCaptions = (id, token) => {
    const headers = { 
        'Authorization': `Bearer ${token}` 
    };
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/captions?user-id=${id}`,
        header: token ? headers : {}
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

export const getFilteredCaptionsUser = (userId, filter, token) => {
    const baseQuery = `?user-id=${userId}`;
    return getFilteredCaptions(baseQuery, filter, token);
}

export const getFilteredCaptionsByMoment = (momentId, filter, token) => {
    const baseQuery = `?moment-id=${momentId}`;
    return getFilteredCaptions(baseQuery, filter, token);
}

const getFilteredCaptions = (baseQuery, filter, token) => {
    const filterQuery = getFilterQuery(filter);
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    return axios({
        method: 'get',
        url: `http://${process.env.REACT_APP_IP}/api/captions${baseQuery}${filterQuery}`,
        headers: token ? headers : {}
    })
}

const getFilterQuery = filter => {
    switch (filter) {
        case 'Oldest':
            return '&order=asc';
        case 'Top':
            return '&filter=votes';
        case 'Worst':
            return '&filter=votes&order=asc';
        case 'Accepted': 
            return '&filter=acceptance';
        case 'Rejected':
            return '&filter=acceptance&order=asc';
        default: 
            return '';
    }
}
