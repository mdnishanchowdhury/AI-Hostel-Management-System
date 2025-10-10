import axios from "axios";

const axiosPublic = axios.create({
    // https://aihostelmanagement.vercel.app
    baseURL: 'https://aihostelmanagement.vercel.app'
});
const useAxiosPublic = () => {
    return axiosPublic;
}

export default useAxiosPublic