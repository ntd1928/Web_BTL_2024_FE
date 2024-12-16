import {useState,useEffect} from 'react';
import '../../../../styles/Login.css';
import Swal from 'sweetalert2';
import {ThreeDots} from 'react-loader-spinner';
import Pagination from '../../../../pagination';
import { deleteComment, getAllComments, updateComment } from '../../../../services/blogService';
import ModalEditComment from '../edit';
import Blog from './Blog';
import User from './User';
import Select from 'react-select'

const ListComment = () => {
    const [arrComment,setArrComment]=useState([]);
    const [commentData,setCommentData]=useState([]);
    const [isOpenModalEditComment,setIsOpenModalEditComment]=useState(false);
    const [commentEdit,setCommentEdit]=useState({})
    
    // const [pagColor,setPagColor]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);

    useEffect(()=>{
        getAllCommentsFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllCommentsFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllComments('ALL');
        if(response && response.data.errCode === 0){
            setCommentData(response.data.comments);
            pagination(response.data.comments);
           
        }
    }
    const pagination = (tdata)=>{
        var slice = tdata.slice(offset, offset + perPage)
        setPageCount(Math.ceil(tdata.length / perPage));
        // setPagColor(tdata);
        setArrComment(slice);
        setIsLoaded(true);
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };


    const toggleCommentEditModal = ()=>{
        setIsOpenModalEditComment(!isOpenModalEditComment);

    }


    const handleDeleteComment= (comment)=>{
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
                    let res = await deleteComment(comment.id);
                    if(res && res.data.errCode === 0){
                        await getAllCommentsFromReact();
                        Swal.fire(
                            'Deleted!',
                            'Your comment has been deleted.',
                            'success'
                        )
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

    const handleEditComment = async(comment)=>{
        setIsOpenModalEditComment(true);
        setCommentEdit(comment);
    }

    const doEditComment = async(comment) => {
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    let res = await updateComment(comment);
                    console.log("do edit:",res);
                    if(res && res.data.errCode===0){
                        setIsOpenModalEditComment(false)
                        await getAllCommentsFromReact()
                        Swal.fire('Saved!', '', 'success')
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
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
          })
        
    }
    const options = [
        { value: 1, label: 'Yes' },
        { value: 0, label: 'No' },
      ]
    const handleSelectChange = (name) => {
        if(name){
            const search = commentData.filter(item => (item.status === name.value));
            setArrComment(search);
            pagination(search);
        }
    };
      
      
    return (
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Comment</h3>
                </div>
                
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item active">Comment</li>
            </ol>
            
            {isOpenModalEditComment&&
            <ModalEditComment
                isOpen = {isOpenModalEditComment}
                editComment = {doEditComment}
                toggleFromParent = {toggleCommentEditModal}
                currentComment = {commentEdit}
            />
            }
           <div className='form-container mt-4'>
                <h4 className='text-center form-title'>List Of Comments</h4>
                <div className='form-body'>
                    <div className='d-flex align-items-center'>
                        
                        <b className='me-3'>Status: </b> <Select options={options} onChange={handleSelectChange} />
                            
                    </div>
                    
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    <th className='text-center align-middle form-title'>id</th>
                                    <th className='text-center align-middle form-title'>Blog</th>
                                    <th className='text-center align-middle form-title'>User</th>
                                    <th className='text-center align-middle form-title'>Content</th>
                                    <th className='text-center align-middle form-title'>Approved</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isloaded ? arrComment && arrComment.map((item,index)=>{
                                    return(
                                        <tr key={item.id}>
                                            <td className='text-center align-middle'>{index + 1}</td>
                                            <td className='text-center align-middle'>{item.id}</td>
                                            <Blog blogId={item.blogId} />
                                            <User userId={item.userId} />
                                            <td className='text-center align-middle'>{item.content}</td>
                                            <td className='text-center align-middle'>
                                                {item.status === 0 ?
                                                <p className='text-danger'>No</p>
                                                :
                                                <p className='text-danger'>Yes</p>
                                                }
                                            </td>
                                            <td className='text-center align-middle'>
                                                <span onClick={()=>{handleEditComment(item)}} className="hover-icon text-success">
                                                    <i className="fa-solid fa-pen-to-square me-3"></i>
                                                </span>
                                                <span onClick={()=>{handleDeleteComment(item)}} className="hover-icon text-danger">
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
export default ListComment;

