import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000'
})

const UseAxios = () => {
    return AxiosInstance;
};

export default UseAxios;