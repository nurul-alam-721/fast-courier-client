import React from 'react';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';

const RiderRoute = ({children}) => {
     const { user, loading } = useAuth();
    const {role, roleLoading} = useUserRole();

  if (loading || roleLoading) {
    return <div className="text-center text-xl py-10">Loading...</div>;
  }

  if (!user || role !== 'rider') {
    return <Navigate state={{ from: location.pathname }}   to="/forbidden"/>;
  }

    return  children;
};

export default RiderRoute;