import axios from "axios";
import { API_URL } from "../config/apiUrl";
const getAllCategories = (inputId) => {
    return axios.get(`${API_URL}/api/get-all-categories?id=${inputId}`)
}

const getAllCategoriesWithPagination = (inputId,page,limit) => {
    return axios.get(`${API_URL}/api/get-all-categories-pagination?search=${inputId}&page=${page}&limit=${limit}`)
}
const createNewCategoryService = (data) =>{
    return axios.post(`${API_URL}/api/create-new-category`,data);
}

const deleteCategoryService = (categoryId) =>{
    return axios.delete(`${API_URL}/api/delete-category`,{
        data:{
            id:categoryId
        }
    });
}

const updateCategoryService = (inputData) =>{
    return axios.put(`${API_URL}/api/update-category`,inputData)
}

export {
    getAllCategories,
    createNewCategoryService,
    updateCategoryService,
    deleteCategoryService,
    getAllCategoriesWithPagination
}