import base64url from 'base64url';
import Cookies from 'universal-cookie';
import axios from 'axios';

const validateToken = () => new Promise((resolve, reject) => {
    const cookies = new Cookies();
    const token =  cookies.get('token');

    if(!token) {
        return reject('no token');
    }

    axios({
        url: `http://${process.env.REACT_APP_IP}/api/auth/tokens`,
        method: 'post',
        data: {
            token,
        },
    })
        .then(({ data }) => {     
            const cookies = new Cookies();
            if (data.code === 1) {
                cookies.set('token', data.newToken);
                resolve(data.newToken);
            }
            // TODO: do stuff based on error code
            reject(data.code);
        })
        .catch(err => {
            cookies.remove('token');
            reject(err);
        });
})

const getUser = () => {
    const cookies = new Cookies();
    const token =  cookies.get('token');

    return token
        ? base64url.decode(cookies.get('token').split('.')[1])
        : null;
};

const getToken = () => {
    const cookies = new Cookies();
    return cookies.get('token');
}

const logout = () => {
    const cookies = new Cookies();
    cookies.remove('token');
    window.location.reload();
};

export {
    validateToken,
    getUser,
    logout,
    getToken,
};
