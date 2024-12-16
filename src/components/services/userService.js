import axios from "axios";
import { API_URL } from "../config/apiUrl";

const handleLoginApi = (data) => {
    return axios.post(`${API_URL}/api/login`,data);
}
const handleRegisterApi = (data)=>{
    return axios.post(`${API_URL}/api/register`,data);
}
const getUserByEmail = (inputId) => {
    return axios.get(`${API_URL}/api/get-user-by-email?email=${inputId}`)
}
const getAllUsers = (inputId) => {
    return axios.get(`${API_URL}/api/get-all-users?id=${inputId}`)
}
const getAllUsersWithPagination= async(inputId,page,limit)=>{
    return axios.get(`${API_URL}/api/get-all-users-pagination?search=${inputId}&page=${page}&limit=${limit}`);
}
const createNewUserService = async(data) =>{
    return axios.post(`${API_URL}/api/create-new-user`,data);
}

const deleteUserService = async(userId) =>{
    return axios.delete(`${API_URL}/api/delete-user`,{
        data:{
            id:userId
        }
    });
}

const editUserService = async(inputData) =>{
    return axios.put(`${API_URL}/api/edit-user`,inputData)
}

const authenticate = async (data, email) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('id', data)
        localStorage.setItem('email', email)
        if(email === 'admin@gmail.com'){
            setTimeout(() => {
                window.location.replace('/admin');
              }, 1000);
        }else{
            setTimeout(() => {
                // 👇️ redirects to an external URL
                window.location.replace('/');
              }, 1000);
        }
    }
};
const isAuthenticate = () => {
    if (typeof window == 'undefined') {
        return false;
    }
    return localStorage.getItem('id');
};

const logout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        window.location.href = "/";
    }
};
export {
    handleLoginApi,
    handleRegisterApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllUsersWithPagination,
    authenticate,
    isAuthenticate,
    getUserByEmail,
    logout
}