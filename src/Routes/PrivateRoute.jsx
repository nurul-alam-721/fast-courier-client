import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return <span className="loading loading-ring loading-xl"></span>
    }
    if(!user){
        <Navigate to={'/login'} state={{from: location}} replace></Navigate>
    }

    return children;
};

export default PrivateRoute;