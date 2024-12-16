import axios from "axios";
import { API_URL } from "../config/apiUrl";

const addCart = (data) =>{
    return axios.post(`${API_URL}/api/add-cart`,data);
}

const getCartByUserId = (inputId) => {
    return axios.get(`${API_URL}/api/get-cart-by-user?id=${inputId}`)
}


const updateCart = (data) =>{
    return axios.put(`${API_URL}/api/update-cart`,data);
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

const setOder = async (data) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('data',JSON.stringify(data));
        
        setTimeout(
            function () {
                window.location.reload();
            },
            1000
        );
    }
};

export {
    addCart,
    getCartByUserId,
    deleteCart,
    updateCart,
    deleteAllCart,
    setOder,
}