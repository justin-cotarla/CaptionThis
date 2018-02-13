import moments from './moments';
import captions from './captions';
import users from './users';
import register from './auth/register';
import login from './auth/login';

export default [].concat(
    moments,
    captions,
    users,
    register,
    login,
);
