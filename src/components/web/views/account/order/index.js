import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useEffect, useState } from 'react';
import { getUserByEmail } from '../../../../services/userService';
import { getAllOrdersByUserId } from '../../../../services/orderService';
import DetailOrder from './DetailOrder';
import AddressOrder from './AddressOrder';
import moment from 'moment';
const Order = ()=>{
    const[listOrder,setListOrder]=useState([]);
    useEffect(()=>{
        getOrdersFromReact();
    },[]);
    
    const getOrdersFromReact = async()=>{
        let email = localStorage.getItem('email')
        if (email) {
            let data= await getUserByEmail(email);
            if (data && data.data.errCode === 0) {
                // setUser(data.data.user);
                let list = await getAllOrdersByUserId(data.data.user.id);
                console.log(list);
                if(list && list.data.errCode === 0){
                    setListOrder(list.data.orders);
                    
                }
            }
        }
    }
    return(
        <div className="container">
            <h4 className='mb-4'>My Orders</h4>
            <Tab.Container id="left-tabs-example" defaultActiveKey="1" className="mt-5">
                <Row className='order'>
                    <Col md={4}>
                    <div className="title pb-3">Orders History</div>
                        <Nav className="flex-column order_history">
                            {listOrder && listOrder.map((item,index)=>(
                                <Nav.Item className='mb-2' key={item.id}>
                                    <Nav.Link eventKey={index+1}>
                                        <div className="d-flex justify-content-between align-items-center my-2">
                                            <div>
                                                <b>#{item.number}</b>
                                                <p className="m-0">{new Intl.NumberFormat().format(item.grandtotal)}đ</p>
                                                <p className="text-muted m-0">5 items</p>
                                            </div>
                                            <div className={"text-end " + (item.status === 'processing' ? 'text-primary' : (item.status==='shipping' ? 'text-primary' : (item.status === 'delivered' ? 'text-success':'text-danger')))}>
                                                <i class={"fa-solid " + (item.status === 'processing' ? 'fa-box-open' : (item.status==='shipping' ? 'fa-truck-fast' : (item.status === 'delivered' ? 'fa-box':'fa-triangle-exclamation')))}></i> {item.status}
                                                <br />
                                            </div>
                                        </div>
                                    
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </Col>
                    <Col md={8} style={{borderLeft: "1px solid #ddd"}}>
                    <Tab.Content>
                        {listOrder && listOrder.map((item,index)=>(
                            <>
                            <Tab.Pane eventKey={index+1} key={item.id}>
                            <h5 className="title">Order #{item.number} 
                                <span className='text-muted mb-1' style={{fontWeight:"300"}}>({listOrder.length})</span>
                                
                            </h5>
                            <p className='m-0' style={{fontWeight:"400",color:"#666"}}><span style={{color:"#888"}}>Order date:</span> {moment(item.createdAt).format("YYYY/MM/DD hh:mm")}</p>
                            <hr />
                            
                                <DetailOrder id={item.id} />
                                <hr />
                                <div className="title pb-3">Delivery</div>
                                <AddressOrder idAdd = {item.addressId} />
                                <b className="title pb-3">Delivery Date<span className='text-muted'>(expected)</span>: </b>
                                <span className="text-muted">{item.deliveryDate ? moment(item.deliveryDate).format("YYYY/MM/DD") :''} </span>

                            </Tab.Pane>
                            </>
                        ))}
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>

        </div>
    )
}
export default Order;