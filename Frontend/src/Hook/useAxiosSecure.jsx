import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
const axiosSecure = axios.create({
    // https://aihostelmanagement.vercel.app
    baseURL: 'http://localhost:5000'
});
const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { userLogOut } = useAuth();

    axiosSecure.interceptors.request.use((config) => {
        const token = localStorage.getItem('access-token')
        // console.log('requst by interceptors', token)
        config.headers.authorization = `Bearer ${token}`
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    
    // inteceptors 401 and 403 
    axiosSecure.interceptors.response.use((response) => {
        return response;
    }, async (error) => {
        const status = error.response.status;
        // console.log('status err in the interceptors', status)
        if (status === 401 || status === 403) {
            await userLogOut();
            navigate('/login')
        }
        return Promise.reject(error);
    });
    return axiosSecure;
}

export default useAxiosSecure