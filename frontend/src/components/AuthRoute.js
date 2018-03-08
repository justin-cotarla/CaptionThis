import React from 'react';
import { Route } from 'react-router-dom';

import * as AuthUtil from '../util/AuthUtil';

const AuthRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            <Component
                {...props}
                user={JSON.parse(AuthUtil.getUser())}
                token={AuthUtil.getToken()}
                validateToken={AuthUtil.validateToken}
            />
        )}/>
  );
};

export default AuthRoute;
