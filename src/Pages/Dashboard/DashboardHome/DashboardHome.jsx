import React from 'react';
import Loading from '../../Shared/Loading/Loading';
import UserDashboard from './UserDashboard';
import RiderDashboard from './RiderDashboard';
import AdminDashboard from './AdminDashboard';
import Forbidden from '../../Forbidden/Forbidden';
import useUserRole from '../../../Hooks/useUserRole';

const DashboardHome = () => {
    const {role, roleLoading} = useUserRole();

    if(roleLoading){
       return <Loading></Loading>
    }


    if(role === 'user'){
        return <UserDashboard></UserDashboard>
    }

    else if (role === 'rider'){
        return <RiderDashboard></RiderDashboard>;
    }

    else if(role === 'admin'){
        return <AdminDashboard></AdminDashboard>;
    }

    else Forbidden;

};

export default DashboardHome;