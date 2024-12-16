import axios from "axios";
import { API_URL } from "../config/apiUrl";

const createAddress = (data,userId) =>{
    console.log(data,userId);
    return axios.post(`${API_URL}/api/create-address`,{
        dataList:{
            data:data,
            userId:userId
        }
    });
}
const getAllAddress = (inputId) => {
    return axios.get(`${API_URL}/api/get-address?id=${inputId}`);
}

const getAllAddressByUserId = (inputId) => {
    return axios.get(`${API_URL}/api/get-address-by-user?id=${inputId}`)
}

const updateAddress = (data) =>{
    return axios.put(`${API_URL}/api/update-address`,data);
}

const deleteCart = (cartId) =>{
    return axios.delete(`${API_URL}/api/delete-cart`,{
        data:{
            cartId:cartId
        }
    });
}

const deleteAllCart = (userId) =>{
    return axios.delete(`${API_URL}/api/delete-all-cart`,{
        data:{
            userId:userId
        }
    });
}


export {
    createAddress,
    getAllAddress,
    getAllAddressByUserId,
    deleteCart,
    updateAddress,
    deleteAllCart
}