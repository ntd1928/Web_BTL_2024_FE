import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../../../../styles/Login.css';
import { deleteBlog, getAllBlogs } from '../../../../services/blogService';
import { IMG_URL } from '../../../../config/imgUrl';
import {ThreeDots} from 'react-loader-spinner';
import Pagination from '../../../../pagination';
import Swal from 'sweetalert2';
// import ReactSearchBox from "react-search-box";


const ListBlog =()=> {

    const [arrBlogs,setArrBlogs]=useState([]);
    const [blogData,setBlogData]=useState([]);

    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);
    
    // const [isOpenModalDetailProduct,setIsOpenModalDetailProduct]=useState(false);
   
    useEffect(()=>{
        getAllBlogsFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllBlogsFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllBlogs('ALL');
        if(response && response.data.errCode === 0){
            setBlogData(response.data.blogs);
            pagination(response.data.blogs);
            
        }
    }
    const pagination = (tdata)=>{
        var slice = tdata.slice(offset, offset + perPage)
            setPageCount(Math.ceil(tdata.length / perPage));
            // setPagProduct(tdata);
            setArrBlogs(slice);
            setIsLoaded(true);
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };
    
    const handleDeleteBlog= async(blog)=>{
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
                    let res = await deleteBlog(blog.id);
                    if(res && res.data.errCode === 0){
                        await getAllBlogsFromReact();
                    }else{
                        alert(res.data.errMessage)
                    }
                } catch (error) {
                    console.log(error)
                }
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
          })
    }  
    const [filterParam, setFilterParam] = useState('');

    const handleFilter = async(e)=>{
        setFilterParam(e.target.value);
        if(e.target.value===''){
            setArrBlogs(blogData);
        }else{
            const search = blogData.filter(item => (item.name.toLowerCase().includes(e.target.value.toLowerCase())|| item.writer.toLowerCase().includes(e.target.value.toLowerCase())));
            setArrBlogs(search)
        }
        

    }
    return (
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Blog</h3>
                </div>
              
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                <li className="breadcrumb-item active">Blog</li>
            </ol>
          
            <div className='form-container mt-4'>
                <h4 className='text-center form-title'>List Of Blogs</h4>
                <div className='form-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                            <div class="search">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <input className="form-control" type="text" placeholder="Search name, writer..." 
                                    value={filterParam}
                                    onChange={(e) => handleFilter(e)}

                                />
                            </div>
                            <div className='mx-2'>
                                <a href='/admin/add-blog'><button className='btn add-product'><i class="fa-solid fa-plus me-2"></i>Add</button></a>
                            </div>
                    </div>
                   
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    {/* <th className='text-center align-middle form-title'>Mã</th> */}
                                    <th className='text-center align-middle form-title col-3'>Name</th>
                                    <th className='text-center align-middle form-title col-1'>Photo</th>
                                    <th className='text-center align-middle form-title'>Writer</th>
                                    <th className='text-center align-middle form-title'>Hidden</th>
                                    <th className='text-center align-middle form-title'>New Blog</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {isloaded ? 
                                arrBlogs && arrBlogs.map((blog,index)=>{
                                    return(
                                       <tr key={blog.id}>
                                            <td className='text-center align-middle'>{index+1}</td>
                                            {/* <td className='text-center align-middle'>{blog.id}</td> */}
                                            <td className='text-center align-middle'>{blog.name}</td>
                                            <td className='text-center align-middle'>
                                                <img src={`${IMG_URL}/${blog.photo}`} alt={blog.name} className="img-fluid" />
                                            </td>
                                            <td className='text-center align-middle'>{blog.writer}</td>
                                            <td className='text-center align-middle'>
                                                {blog.hidden===0 ?
                                                    <span><i className="fa-solid fa-xmark text-danger"></i> No</span>
                                                :
                                                    <span><i className="fa-solid fa-check text-success"></i> Yes</span>
                                                }
                                                
                                            </td>
                                            <td className='text-center align-middle'>
                                                {blog.newBlog===0 ?
                                                    <span><i className="fa-solid fa-xmark text-danger"></i> No</span>
                                                :
                                                    <span><i className="fa-solid fa-check text-success"></i> Yes</span>
                                                }
                                            </td>
                                            <td className='text-center align-middle'>
                                                
                                                <Link to={`/admin/edit-blog/${blog.id}`} alt="Edit">
                                                    <span className="hover-icon text-success">
                                                        <i className="fa-solid fa-pen-to-square me-3"></i>
                                                    </span>
                                                </Link>
                                                <span onClick={()=>handleDeleteBlog(blog)} className="hover-icon text-danger" alt="Delete">
                                                    <i className="fa-solid fa-trash"></i>
                                                </span>
                                               
                                            </td>
                                        </tr>                                        
                                    )
                                })
                                : 
                                <ThreeDots 
                                    height="60" 
                                    width="60" 
                                    radius="9"
                                    color="#FF6600" 
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                    />
                                }
                            </tbody>
                        </table>
                        
                    </div>
                    
                    {isloaded &&
                        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} currentPage={currentPage} />
                    }
                </div>
            </div>
            
        </div>

    )
}

export default ListBlog;