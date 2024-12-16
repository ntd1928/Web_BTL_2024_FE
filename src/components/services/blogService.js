import axios from "axios";
import { API_URL } from "../config/apiUrl";

const createBlog = (data) =>{
    return axios.post(`${API_URL}/api/create-new-blog`,data);
}

const addComment = (data) =>{
    return axios.post(`${API_URL}/api/add-comment`,data);
}

const getAllBlogs = (inputId) => {
    return axios.get(`${API_URL}/api/get-all-blogs?id=${inputId}`);
}

const getAllComments = (inputId) => {
    return axios.get(`${API_URL}/api/get-all-comments?id=${inputId}`);
}
const updateComment = (data) =>{
    return axios.put(`${API_URL}/api/update-comment`,data);
}
const updateCommentUser = (data) =>{
    return axios.put(`${API_URL}/api/update-comment-user`,data);
}
const updateBlog = (data) =>{
    return axios.put(`${API_URL}/api/update-blog`,data);
}

const deleteBlog = (blogId) =>{
    return axios.delete(`${API_URL}/api/delete-blog`,{
        data:{
            blogId:blogId
        }
    });
}

const deleteComment = (commentId) =>{
    return axios.delete(`${API_URL}/api/delete-comment`,{
        data:{
            commentId:commentId
        }
    });
}




export {
    createBlog,
    getAllBlogs,
    deleteBlog,
    updateBlog,
    deleteComment,
    addComment,
    getAllComments,
    updateComment,
    updateCommentUser
}