import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getAllOrders, getDetailOrdersByOrderId } from "../../../../services/orderService";
import Product from "./Product";
import { getAllAddress } from "../../../../services/addressService";
import moment from "moment";
const ModalDetailOrder = ()=>{
    const {id} = useParams();
    const [detailOrder,setDetail]=useState([]);
    const [order,setOrder]=useState({});
    const [address,setAddress]=useState({});

    useEffect (()=>{
        const getOrderFromReact=async()=>{
            const res = await getAllOrders(id);
            if(res && res.data.errCode===0){
                console.log(res.data.orders)
                setOrder(res.data.orders);
                const add = await getAllAddress(res.data.orders.addressId);
                if(add && add.data.errCode===0){
                    setAddress(add.data.address);
                }
            }
        }
        getOrderFromReact();
    },[id])

    useEffect(()=>{
       const getDetailFromReact =async()=>{
        const res = await getDetailOrdersByOrderId(id);
        if(res && res.data.errCode===0){
            setDetail(res.data.detailorders);
        }
       } 
       getDetailFromReact();
    },[id]);

    return (
        <div className="list">
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Order</h3>
                </div>
                {/* <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={(e) => this.handleBack()}><i className="fas fa-arrow-left" /> Back</Button>
                </div> */}
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li className="breadcrumb-item"><NavLink to="orders">Order</NavLink></li>
                <li className="breadcrumb-item active">View Detail Order</li>
            </ol>
            <div class="container-fluid detail-order">
                <div class="container">
                <div class="d-flex justify-content-between align-items-center py-3">
                    <h2 class="h5 mb-0"> Order #{order.number}</h2>
                </div>

                <div class="row">
                    <div class="col-lg-8">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="mb-3 d-flex justify-content-between">
                                <div>
                                <span class="me-3">{moment(order.createdAt).format("YYYY-MM-DD")}</span>
                                <span class="me-3">#{order.number}</span>
                                {order.status === 'processing' && 
                                    <span class="badge rounded-pill bg-info" style={{textTransform:"uppercase"}}>{order.status}</span>
                                }
                                </div>
                                {/* <div class="d-flex">
                                    <button class="btn btn-link p-0 me-3 d-none d-lg-block btn-icon-text"><i class="bi bi-download"></i> <span class="text">Invoice</span></button>
                                    <div class="dropdown">
                                        <button class="btn btn-link p-0 text-muted" type="button" data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                        <li><a class="dropdown-item" href="sdd"><i class="bi bi-pencil"></i> Edit</a></li>
                                        <li><a class="dropdown-item" href="sdd"><i class="bi bi-printer"></i> Print</a></li>
                                        </ul>
                                    </div>
                                </div> */}
                            </div>
                        <table class="table table-borderless">
                            <tbody>
                                {detailOrder && detailOrder.map((item)=>(
                                    <tr key={item.id}>
                                        <td>
                                            <Product id={item.productId} color={item.color} />
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td class="text-end">{new Intl.NumberFormat().format(item.price)}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="2">Subtotal</td>
                                    <td class="text-end">{new Intl.NumberFormat().format(order.grandtotal)}đ</td>
                                </tr>
                                <tr>
                                    <td colSpan="2">Shipping</td>
                                    <td class="text-end">0đ</td>
                                </tr>
                                
                                <tr class="fw-bold">
                                    <td colSpan="2">TOTAL</td>
                                    <td class="text-end">{new Intl.NumberFormat().format(order.grandtotal)}đ</td>
                                </tr>
                            </tfoot>
                        </table>
                        </div>
                    </div>
                    
                    </div>
                    <div class="col-lg-4">
                    <div class="card mb-4">
                        <div class="card-body">
                        <h3 class="h6">Customer Notes</h3>
                        {order.message ?
                            <p>{order.message}</p>
                        :
                        <p>No notes</p>
                        }
                        </div>
                    </div>
                    <div class="card mb-4">
                        <div class="card-body">
                        <h3 class="h6">Shipping Information</h3>                    
                        <hr />
                        <h3 class="h6">Address</h3>
                        <address>
                            <strong>{address.fullName}</strong><br />
                            {address.shippingAdr}<br />
                            {address.ward}, {address.district}, {address.city}<br />
                            <abbr>Phone number:</abbr> {address.phoneNumber}
                        </address>
                        <h3 class="h6">Delivery Date</h3>
                        <span>{order.deliveryDate ? moment(order.deliveryDate).format("YYYY-MM-DD") : 'No Update'}</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>

        </div>
    )
}
export default ModalDetailOrder;