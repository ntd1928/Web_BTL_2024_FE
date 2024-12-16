import { useEffect, useState } from "react";
import { getAllOrders } from "../../../services/orderService";
import { getAllFeedbacks } from "../../../services/productService";
import { getAllUsers } from "../../../services/userService";
import User from "../order/list/User";
import moment from "moment";
import { Link } from "react-router-dom";

const Dashboard = ()=>{
    const [order,setOrder]=useState([]);
    const [delivered,setDelivered]=useState([]);
    const [feedback,setFeedback]=useState([]);
    const [user,setUser]=useState([]);

    useEffect(()=>{
        const getOrder = async()=>{
            const res = await getAllOrders('ALL');
            if(res && res.data.errCode ===0){
                var data = res.data.orders;
                setOrder(data);
                var tt= 0 ; 
                for(var i=0;i<res.data.orders.length;i++){
                    if(data[i].status === 'delivered'){
                        tt = tt+1;
                        
                    }
                }
                setDelivered(tt);
            }
        }
        getOrder();
    },[]);

    useEffect(()=>{
        const getFeedback =async()=>{
            const response = await getAllFeedbacks('ALL');
            if(response && response.data.errCode === 0){
                setFeedback(response.data.feedbacks);
               
            }
        }
        getFeedback();
    },[])
    useEffect(()=>{
        const getUser =async()=>{
            const response = await getAllUsers('ALL');
            if(response && response.data.errCode === 0){
                setUser(response.data.users);
               
            }
        }
        getUser();
    },[])
    return(
        
<div class="container list">
    <div className="row">
        <div className="col-lg-5 col-md-9 col-lg-6">
            <h3 className="mt-30 page-title">Dashboard</h3>
        </div>
        {/* <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
            <Button variant="contained" onClick={(e) => this.handleBack()}><i className="fas fa-arrow-left" /> Back</Button>
        </div> */}
    </div>
    <ol className="breadcrumb mb-30">
        <li className="breadcrumb-item active"><a href="/admin">Dashboard</a></li>
    </ol>
    <div class="row">
        <div class="col-xl-3 col-md-6">
            <div class="card bg-pattern">
                <div class="card-body">
                    <div class="text-end">
                        <i class="fa-solid fa-box-open text-primary" style={{fontSize:"30px"}}></i>
                    </div>
                    <h5 class="font-size-20 mt-0 pt-1">{order.length}</h5>
                    <p class="text-muted mb-0">Total Orders</p>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6">
            <div class="card bg-pattern">
                <div class="card-body">
                    <div class="text-end">
                    <i class="fa-solid fa-people-carry-box text-success" style={{fontSize:"30px"}}></i>
                    </div>
                    <h5 class="font-size-20 mt-0 pt-1">{delivered}</h5>
                    <p class="text-muted mb-0">Delivered Orders</p>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6">
            <div class="card bg-pattern">
                <div class="card-body">
                    <div class="text-end">
                    <i class="fa-regular fa-comments text-danger" style={{fontSize:"30px"}}></i>
                    </div>
                    <h5 class="font-size-20 mt-0 pt-1">{feedback.length}</h5>
                    <p class="text-muted mb-0">Total Feedback</p>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6">
            <div class="card bg-pattern">
                <div class="card-body">
                    <div class="text-end">
                    <i class="fa-regular fa-user text-warning" style={{fontSize:"30px"}}></i>
                    </div>
                    <h5 class="font-size-20 mt-0 pt-1">{user.length}</h5>
                    <p class="text-muted mb-0">Total User</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div className="d-flex justify-content-between card-header" style={{background:"none"}}>
                    <b>List Order Delivered</b>
                    <Link to="/admin/orders" >See more</Link>
                </div>
                <div class="card-body">
                    
                    <div class="table-responsive project-list">
                        <table class="table project-table table-centered table-nowrap">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">Number</th>
                                    <th className="text-center" scope="col">Email Customer</th>
                                    <th className="text-center" scope="col">Delivered Date</th>
                                    <th className="text-center" scope="col">CreatedAt</th>
                                    <th className="text-center" scope="col">Grand Total</th>
                                    <th className="text-center" scope="col">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order && order.map((item,index)=>{
                                    return item.status === 'delivered' && (
                                        <tr key={item.id}>
                                            <th className="text-center align-middle" scope="row">{item.number}</th>
                                            <User idUser = {item.userId}/>
                                            <td className="text-center align-middle">{item.deliveryDate ? moment(item.deliveryDate).format("YYYY-MM-DD") : 'No update'}</td>
                                            <td className="text-center align-middle">
                                                {moment(item.createdAt).format("YYYY-MM-DD")}
                                            </td>
                                            <td className="text-center align-middle">
                                            {new Intl.NumberFormat().format(item.grandtotal)}
                                            </td>
                                            <td className="text-center align-middle">
                                                <p class="mb-0"><span class="text-end">100%</span></p>

                                                <div class="progress mt-2" style={{height:"5px"}}>
                                                    <div class="progress-bar bg-success" role="progressbar" style={{width:"100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </td>

                                            
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>
    )
}
export default Dashboard;