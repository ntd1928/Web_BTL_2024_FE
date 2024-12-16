import { useState,useEffect } from "react";
import { getAllOrders, updateOrder } from "../../../../services/orderService";
import { ThreeDots } from "react-loader-spinner";
import Pagination from "../../../../pagination";
import moment from "moment";
import Swal from "sweetalert2";
import ModalEditOrder from "../edit";
import User from "./User";
import { Link } from "react-router-dom";
const ListOrder = ()=>{

    const [arrOrder,setOrder]=useState([]);
    const [orderData,setOrderData]=useState([]);
    const [isOpenModalEditOrder,setIsOpenModalEditOrder]=useState(false);
    const [orderEdit,setOrderEdit]=useState({})
    
    // const [pagColor,setPagColor]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);


    useEffect(()=>{
        getAllOrdersFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllOrdersFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllOrders('ALL');
        if(response && response.data.errCode === 0){
            setOrderData(response.data.orders);
            pagination(response.data.orders);
        }
    }
    const pagination = (tdata)=>{
        var slice = tdata.slice(offset, offset + perPage)
            setPageCount(Math.ceil(tdata.length / perPage));
            // setPagColor(tdata);
            setOrder(slice);
            setIsLoaded(true);
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };
    const toggleOrderEditModal = ()=>{
        setIsOpenModalEditOrder(!isOpenModalEditOrder);

    }
    const handleEditOrder = async(order)=>{
        setIsOpenModalEditOrder(true);
        setOrderEdit(order);
    }

    const doEditOrder = async(order) => {
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
                    let res = await updateOrder(order);
                    console.log("do edit:",res);
                    if(res && res.data.errCode===0){
                        setIsOpenModalEditOrder(false)
                        await getAllOrdersFromReact()
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
    const [filterParam, setFilterParam] = useState('');

    const handleFilter = async(e)=>{
        setFilterParam(e.target.value);
        if(e.target.value===''){
            setOrder(orderData);
        }else{
            const search = orderData.filter(item => (item.status.toLowerCase().includes(e.target.value.toLowerCase())|| item.number.toLowerCase().includes(e.target.value.toLowerCase())));
            setOrder(search)
        }
        

    }

    return(
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Order</h3>
                </div>
               
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item active">Order</li>
            </ol>
           
            {isOpenModalEditOrder&&
            <ModalEditOrder
                isOpen = {isOpenModalEditOrder}
                editOrder = {doEditOrder}
                toggleFromParent = {toggleOrderEditModal}
                currentOrder = {orderEdit}
            />
            }
           <div className='form-container mt-4'>
                <h4 className='text-center form-title'>List Of Orders</h4>
                
                <div className='form-body'>
                    <div class="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input className="form-control" type="text" placeholder="Search status, number..." 
                            value={filterParam}
                            onChange={(e) => handleFilter(e)}

                        />
                    </div>
                    
                    
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    <th className='text-center align-middle form-title'>Number</th>
                                    <th className='text-center align-middle form-title'>Email Customer</th>
                                    <th className='text-center align-middle form-title'>Grand Total</th>
                                    <th className='text-center align-middle form-title'>Status</th>
                                    <th className='text-center align-middle form-title'>CreatedAt</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isloaded ? arrOrder && arrOrder.map((item,index)=>{
                                    return(
                                        <tr key={item.id}>
                                            <td className='text-center align-middle'>{index + 1}</td>
                                            <td className='text-center align-middle'>{item.number}</td>
                                            <User idUser = {item.userId}/>
                                            <td className='text-center align-middle'>{new Intl.NumberFormat().format(item.grandtotal)}</td>
                                            <td className='text-center align-middle'>
                                                {item.status === 'processing' &&
                                                <span className="text-info "><i class="fa-solid fa-circle me-2" style={{fontSize:"10px"}}></i>{item.status}</span>
                                                }
                                                {item.status === 'shipping' &&
                                                <span className="text-info "><i class="fa-solid fa-circle me-2" style={{fontSize:"10px"}}></i>{item.status}</span>
                                                }
                                                {item.status === 'delivered' &&
                                                <span className="text-success "><i class="fa-solid fa-circle me-2" style={{fontSize:"10px"}}></i>{item.status}</span>
                                                }
                                                {item.status === 'cancel' &&
                                                <span className="text-danger"><i class="fa-solid fa-circle me-2" style={{fontSize:"10px"}}></i>{item.status}</span>
                                                }
                                            </td>
                                            <td className='text-center align-middle'>{moment(item.createdAt).format("YYYY/MM/DD hh:mm")}</td>
                                            <td className='text-center align-middle'>
                                                <Link to={`/admin/orders/${item.id}`} alt="view detail">
                                                    <span className="hover-icon text-warning me-3">
                                                    <i class="fa-solid fa-circle-info"></i>
                                                    </span>
                                                </Link>
                                                <span onClick={()=>{handleEditOrder(item)}} className="hover-icon text-success">
                                                    <i className="fa-solid fa-pen-to-square me-3"></i>
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
export default ListOrder;