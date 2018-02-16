import base64url from 'base64url';
import Cookies from 'universal-cookie';
import axios from 'axios';

const authenticate = () => new Promise((resolve, reject) => {
    const cookies = new Cookies();
    const token =  cookies.get('token');

    if(!token) {
        return reject('no token');
    }

    return resolve(axios({
        url: `http://${process.env.REACT_APP_IP}/api/auth/tokens`,
        method: 'post',
        data: {
            token,
        },
    }))
})
    .then(({ data }) => {     
        if (data.code === 1) {
            return base64url.decode(data.newToken.split('.')[1]);
        }
        // TODO: do stuff based on error code
        return Promise.reject(data.code);
    })

const logout = () => {
    const cookies = new Cookies();
    cookies.remove('token');
    window.location.reload();
};

export {
    authenticate,
    logout,
};
