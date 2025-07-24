import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000',
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(
      (config) => {
        if (user && user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axiosSecure.interceptors.request.eject(interceptor); // cleanup
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
