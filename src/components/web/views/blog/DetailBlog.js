import { useEffect, useState } from "react";
import { NavLink,Link, useParams } from "react-router-dom";
import { addComment, deleteComment, getAllBlogs, getAllComments, updateCommentUser } from '../../../services/blogService';
import moment from "moment";
import {IMG_URL} from '../../../config/imgUrl';
import { getUserByEmail } from "../../../services/userService";
import Swal from "sweetalert2";
import User from "./User";
const DetailBlog =()=>{
    const {id} = useParams();
    const [blog,setBlog]=useState({});
    const [arrBlogs,setArrBlogs]=useState([]);
    const [arrComment,setArrComment]=useState([]);
    const [userId,setUserId]=useState('');
    const [arrInput,setArrInput]=useState({
        content:''
    })
    const [isEdit,setIsEdit]=useState(false);
    const [currentId, setCurrentId] = useState('');

    const handleChange=(e)=>{
        const {name,value}=e.target
        setArrInput({...arrInput,[name]:value})
    }

    useEffect(()=>{
        const getAllBlogsFromReactById = async()=>{
            const response = await getAllBlogs(id);
            console.log(response)
            if(response && response.data.errCode === 0){
                setBlog(response.data.blogs);
            }
        }
        getAllBlogsFromReactById();
    },[id]);

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

    useEffect(()=>{
        const getUser = async()=>{
            let email = localStorage.getItem('email');
            if (email) {
                let user = await getUserByEmail(email);
                if (user && user.data.errCode === 0) {
                    setUserId(user.data.user.id)
                }
            }
          }
          getUser();
    },[]);

    useEffect(()=>{
        
        getCommentsFromReact();
    },[])
    const getCommentsFromReact=async()=>{
        const res = await getAllComments('ALL');
        if(res && res.data.errCode===0){
            setArrComment(res.data.comments);
        }
    }

    const handleAddComment = async()=>{
        const {content}=arrInput;
        const data = {content:content,userId:userId,blogId:blog.id}
        console.log('modal reactjs:',data)
        if(data.userId === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please login or resgiter!',
              })
        }else if(data.content===''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please check your input!',
                })
        }else{
            let add = await addComment(data);
            console.log(add);
            if(add && add.data.errCode === 0){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  setArrInput({
                    content:''
                  });
                  await getCommentsFromReact();
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: add.data.message,
                  })
            }
        }
    }
    const handleEditComment = (item)=>{
        setCurrentId(item.id);
        setIsEdit(!isEdit);
        setArrInput({
            content:item.content
        })

    }
    const handleSaveComment = async(item)=>{
        try {
            const data = {id:item.id,content:arrInput.content}
            const update = await updateCommentUser(data);
            console.log(update);
            if(update && update.data.errCode===0){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                  })
                setIsEdit(false);
                await getCommentsFromReact();
                
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
        }
    }
    const handleDeleteComment= (commentId)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    let res = await deleteComment(commentId);
                    if(res && res.data.errCode === 0){
                        Swal.fire(
                            'Deleted!',
                            res.data.errMessage,
                            'success'
                        )
                        await getCommentsFromReact();
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.errMessage,
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error,
                    })
                }
                
            }
          })
        
    }
    console.log(arrComment);
    return(
        <div className="blog_main blog">
        <hr />
            <main>
            <div class="container">
                <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item" ><NavLink style={{color:"e74c3c"}} to="blog">Blogs</NavLink></li>
                    <li class="breadcrumb-item active" aria-current="page">{blog.name}</li>
                </ol>
                </nav>
                <div class="row">
                    <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                        <img class="img-fluid" src={`${IMG_URL}/${blog.photo}`} alt={blog.name} />
                        <h3 class="pt-4">{blog.name}</h3>
                        <div class="blog-post-meta">   
                            <span class="author vcard">Writer: {blog.writer}</span>
                            <span class="date">                
                                <time pubdate="" datetime={moment(blog.createdAt).format("YYYY.MM.DD")}> {moment(blog.createdAt).format("YYYY.MM.DD")}</time>
                            </span>                 
                        </div>
                        <p dangerouslySetInnerHTML={{__html: blog.content}} class="entry-content ql-editor" style={{whiteSpace:"pre-line"}} />
                       
                        <div class="bg-light rounded-3 px-3 py-4 mt-5 border">
                            <p><b>Write Comment ...</b><i class="fa-solid fa-pen"></i></p>
                            <div>
                                <textarea name="content" value={arrInput.content} class="form-control mb-1" rows="3" placeholder="Comment..." onChange={(e)=>handleChange(e)}></textarea>
                                <p class="text-muted">Your comment will be approved before posting!</p>
                                <button onClick={()=>{handleAddComment()}} class="btn btn-primary">Post</button>
                            </div>
                        </div>
                        <hr />

                        <div>
                            <h5>View Comment</h5>
                            {arrComment && arrComment.map(item => {
                                return (item.status === 1 && item.blogId === parseInt(id) ) &&(
                                    <div class="border rounded-1 p-3 mb-3 row justify-content-between align-items-center">
                                    
                                        <div className="col-md-10">
                                            <User userId={item.userId} />
                                            <span class="text-muted" style={{fontSize:"14px"}}>{moment(item.createdAt).format("YYYY.MM.DD hh:mm")}</span>
                                            {currentId === item.id && isEdit ?
                                                <input type="text" value={arrInput.content} name="content" onChange={handleChange} className="form-control"/>
                                            :
                                            <p class="me-2">{item.content}</p>
                                             }
                                            
                                        </div>
                                        <div className="col-md-2">
                                            {item.userId === userId && (
                                                <>
                                                {currentId === item.id && isEdit ?
                                                <button className="btn" onClick={()=>handleSaveComment(item)}><i class="fa-regular fa-floppy-disk text-success"></i></button>
                                                :
                                                <button className="btn" onClick={()=>handleEditComment(item)}><i class="fa-regular fa-pen-to-square text-success"></i></button>
                                                }
                                                <button className="btn" onClick={()=>handleDeleteComment(item.id)}><i class="fa-regular fa-trash-can text-danger"></i></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                )
                            })}
                            
                        </div>
                    </div>

                    <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                        <div class="news_latest">
                            <div class="sidebarblog-title">
                                <h3>Bài viết mới nhất</h3>
                            </div>
                            <ul>
                                 
                            {arrBlogs && arrBlogs.map(blog=>{
                            return blog.newBlog === 1 && (
                                <li class="news_title" key={blog.id}>
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
            </main>
        </div>
    )
}
export default DetailBlog;