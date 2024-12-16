import {useEffect, useState} from 'react';
import { getAllBlogs } from '../../../services/blogService';
import {IMG_URL} from '../../../config/imgUrl';
import moment from 'moment';
import { Link } from 'react-router-dom';
const Blog =()=>{
    const [arrBlogs,setArrBlogs]=useState([]);
    useEffect(()=>{
        getAllBlogsFromReact();
    },[])
    const getAllBlogsFromReact = async()=>{
        const response = await getAllBlogs('ALL');
        console.log(response)
        if(response && response.data.errCode === 0){
            setArrBlogs(response.data.blogs);
        }
    }
   
    return(
        <div class="blog">
            <div className="breadcrumb_background_blog">
                <h1 className="title_bg">Blog</h1>
                <div className="overlay"></div>
            </div>
            <div class="container">
            <div class="row">
                <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                    <h2 class="pt-4">Blog</h2>
                        
                        {arrBlogs && arrBlogs.map((blog,index)=>{
                            // khong an
                            return blog.hidden === 0 && (
                                <div class="row py-4" key={blog.id}>
                                    <div class="col-4 img-hover-zoom--1 img-hover-zoom--blur--1">
                                        <Link to={`detail/${blog.slug}/${blog.id}`} class="blog-post-thumbnail" title={blog.name} rel="nofollow">
                                            <img src={`${IMG_URL}/${blog.photo}`} alt={blog.name} class="lazyloaded" />
                                        </Link>
                                    </div>
                                    <div class="col-8">
                                        <h3 class="blog-post-title">
                                            <Link to={`detail/${blog.slug}/${blog.id}`} title={blog.name}>{blog.name}</Link>
                                        </h3>
                                        <div class="blog-post-meta">   
                                            <span class="author vcard">Writer: {blog.writer}</span>
                                            <span class="date">                
                                                <time pubdate="" datetime={moment(blog.createdAt).format("YYYY.MM.DD")}> {moment(blog.createdAt).format("YYYY.MM.DD")}</time>
                                            </span>
                                        </div>
                                        <p class="entry-content">
                                        {blog.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
    
                <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    <div class="news_latest">
                        <div class="sidebarblog-title">
                            <h3>Bài viết mới nhất</h3>
                        </div>
                        <ul>
                           {arrBlogs && arrBlogs.map(blog=>{
                            // tin moi
                            return blog.newBlog === 1 && blog.hidden === 0 && (
                                <li class="news_title">
                                    <div class="img_news">
                                        <Link to={`detail/${blog.slug}/${blog.id}`} title="Nhà đẹp không thể thiếu những món decor này" rel="nofollow">
                                        <img src={`${IMG_URL}/${blog.photo}`} alt={blog.name} class="col-12" />
                                        </Link>
                                    </div>
                                    <div class="content_news">
                                        <h3 class="blog-post-title mt-2">
                                        <Link to={`detail/${blog.slug}/${blog.id}`} title={blog.name}>{blog.name}</Link>
                                        </h3>
                                        <div class="blog-post-meta">   
                                            <span class="author vcard">{blog.writer}</span>
                                            <span class="date">                
                                                <time pubdate="" datetime={moment(blog.createdAt).format("YYYY.MM.DD")}> {moment(blog.createdAt).format("YYYY.MM.DD")}</time>
                                            </span>
                                        </div>
                                      
                                    </div>
                                </li>
                            )
                           })}
                             
                           
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
export default Blog;