import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://cinix-be.vercel.app",
    withCredentials: true
});

export default axiosClient;
