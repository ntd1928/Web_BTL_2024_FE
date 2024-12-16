import { useEffect, useState } from "react";
import { getDetailOrdersByOrderId } from "../../../../services/orderService";
import ProductOrder from "./ProductOrder";
// import { IMG_URL } from "../../../../config/imgUrl";
const DetailOrder = (props)=>{
    const [listDetail,setListDetail]=useState([]);
    const orderId=props.id;
    
    useEffect(()=>{
        const getDetailOrdersFromReact = async()=>{
        let list = await getDetailOrdersByOrderId(orderId);
        console.log(list);
        if(list && list.data.errCode === 0){
            setListDetail(list.data.detailorders);
        }

    }
        getDetailOrdersFromReact()
    },[orderId]);

    
    return(
        <div className='row list_detail_order'>
            {listDetail && listDetail.map((item,index)=>(
            <div className="d-flex justify-content-between align-items-center mb-4 col-12"key={item.id}>
                <div className='d-flex justify-content-between'>
                
                    {/* <img src={`${IMG_URL}/${item.products.photo}`} alt="fdsfds" className='img-fluid' style={{width:"110px"}} /> */}
                    <div className='ms-2'>
                        <ProductOrder idPro = {item.productId} color={item.color}/>
                    </div>
                </div>
                <div className="text-end">
                    <b>{new Intl.NumberFormat().format(item.price)}đ</b>
                    <p className="text-muted m-0">Qty: {item.quantity}</p>
                    {/* <del className='card-price-old'>1,234,455</del> */}
                </div>
            </div>
            ))}
        </div>
            
    )
}
export default DetailOrder;