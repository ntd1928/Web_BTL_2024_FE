import { useEffect, useState } from "react";
import { getAllBlogs } from "../../../../services/blogService";

const Blog = (props)=>{
    const [blog,setBlog]=useState({});
    
    useEffect(()=>{
        const getBlogFromReact = async()=>{
            const res = await getAllBlogs(props.blogId);
            if(res && res.data.errCode===0){
                setBlog(res.data.blogs);
            }
        }
        getBlogFromReact()
    },[props.blogId]);
    return(
        <td className='text-center align-middle'>{blog.name}</td>
    )
}
export default Blog;