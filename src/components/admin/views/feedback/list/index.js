import {useState,useEffect} from 'react';
import '../../../../styles/Login.css';
import Swal from 'sweetalert2';
import {ThreeDots} from 'react-loader-spinner';
import Pagination from '../../../../pagination';

import User from './User';
import { deleteFeedback, getAllFeedbacks } from '../../../../services/productService';
import Product from './Product';

const ListFeedback = () => {
    const [arrFeedback,setArrFeedback]=useState([]);
    
    // const [pagColor,setPagColor]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);

    useEffect(()=>{
        getAllFeedbacksFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllFeedbacksFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllFeedbacks('ALL');
        if(response && response.data.errCode === 0){
            pagination(response.data.feedbacks);
            
        }
    }
    const pagination = (tdata)=>{
        var slice = tdata.slice(offset, offset + perPage)
        setPageCount(Math.ceil(tdata.length / perPage));
        // setPagColor(tdata);
        setArrFeedback(slice);
        setIsLoaded(true);
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };


   

    const handleDeleteFeedback= (feedback)=>{
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
                    let res = await deleteFeedback(feedback.id);
                    if(res && res.data.errCode === 0){
                        await getAllFeedbacksFromReact();
                        Swal.fire(
                            'Deleted!',
                            'Your feedback has been deleted.',
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

    

    return (
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Feedback</h3>
                </div>
                {/* <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={(e) => this.handleBack()}><i className="fas fa-arrow-left" /> Back</Button>
                </div> */}
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item active">Feedback</li>
            </ol>
           
           <div className='form-container mt-4'>
                <h4 className='text-center form-title'>List Of Feedbacks</h4>
                <div className='form-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                        
                        <div className='d-flex'>
                            {/* <form className="d-flex" onSubmit={searchData}>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Search...."
                                    onChange={e=>setSearchInput(e.target.value)}
                                    value={searchInput} 
                                    />
                                <button type='submit' style={{whiteSpace:"nowrap"}} className='btn btn-primary'>Search</button>
                            </form> */}
                            
                        </div>
                    </div>
                    
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    <th className='text-center align-middle form-title'>id</th>
                                    <th className='text-center align-middle form-title'>Product</th>
                                    <th className='text-center align-middle form-title'>User</th>
                                    <th className='text-center align-middle form-title'>Content</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isloaded ? arrFeedback && arrFeedback.map((item,index)=>{
                                    return(
                                        <tr key={item.id}>
                                            <td className='text-center align-middle'>{index + 1}</td>
                                            <td className='text-center align-middle'>{item.id}</td>
                                            <Product productId={item.productId} />
                                            <User userId={item.userId} />
                                            <td className='text-center align-middle'>{item.content}</td>
                                            
                                            <td className='text-center align-middle'>
                                              
                                                <span onClick={()=>{handleDeleteFeedback(item)}} className="hover-icon text-danger">
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
export default ListFeedback;

