import { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { IMG_URL } from "../../../config/imgUrl";
import { getAllProducts,getDetailProductService } from "../../../services/productService";
import Color from "./Color";
import Swal from "sweetalert2";
import { deleteCart, updateCart } from "../../../services/cartService";

const CartItem = (props)=>{
    const [listProduct,setListProduct]=useState({});
    const [listDetail,setListDetail]=useState([]);

    const [listUpdate,setListUpdate]=useState({
        id:props.id,
        quantity:props.quantity,
        color:props.code,
        productId:props.productId,
        userId:props.userId,
        mess:''
    })


    useEffect(()=>{
        getProductFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.productId]);
    
    const getProductFromReact = async()=>{
        let list = await getAllProducts(props.productId);
        if(list && list.data.errCode===0){
            setListProduct(list.data.products);
            let listDetail  = await getDetailProductService(props.productId);
            if(listDetail && listDetail.data.errCode === 0){
                setListDetail(listDetail.data.detailproducts);
            }
            
        }
    }
   
    const handleChangeQuantity=(e)=>{
        if(e.target.name === "minus" && listUpdate.quantity > 1){
            handleUpdateCart(listUpdate.quantity -1,'quantity');
        }
        if(e.target.name === "plus" && listUpdate.quantity < listProduct.totalQty){
            handleUpdateCart(listUpdate.quantity +1,'quantity');
        }
        
    }

    const getColor = (color)=>{
        handleUpdateCart(color,'color');
    }
    const handleUpdateCart = async(data,message)=>{
        if(message === 'quantity'){
            listUpdate.quantity = data;
            setListUpdate({...listUpdate,quantity:data});
            listUpdate.mess = 'quantity'
        }
        if(message === 'color'){
            listUpdate.color = data;
            setListUpdate({...listUpdate,color:data});
            listUpdate.mess = 'color'
        }
        if(Object.keys(listUpdate).length !== '0'){
            let update = await updateCart(listUpdate);
            if(update && update.data.errCode===0){
                Swal.fire({
                    icon: 'success',
                    title: update.data.errMessage,
                    showConfirmButton: false,
                    timer: 1500
                  }) 
                  window.location.href = "cart";
                
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: update.data.errMessage,
                })
                window.location.href = "cart"
                
            }

        }
    }
    const handleDeleteCart= (cartId)=>{
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
                    let res = await deleteCart(cartId);
                    if(res && res.data.errCode === 0){
                        Swal.fire(
                            'Deleted!',
                            res.data.errMessage,
                            'success'
                        )
                        window.location.href = "cart";
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
    
    return(
        <>
        <td className="align-middle">
            <div className='row align-items-center'>
                <div className=' col-5'>
                <img src={`${IMG_URL}/${listProduct.photo}`} alt={listProduct.name} className="img-fluid"/>
                </div>
                <div className='col-7'>{listProduct.name}</div>
            </div>
        </td>
        <td className="align-middle">
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                    <i style={{color:listUpdate.color,fontSize:"25px"}} className="fa-solid fa-circle"></i>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="px-3 py-2">
                                <p className="p-0 m-0" style={{color:"rgba(0,0,0,.54)"}}>Color : </p>
                                <div className="text-center">
                                {listDetail && listDetail.map(item=>{
                                return(
                                    <span key={item.id}>
                                    <Color id={item.colorId} code={props.code} getColor={getColor} />
                                    </span>
                                   
                                )
                                })}  
                                </div>
                            
                            {/* <div className="justify-content-end d-flex">
                                <button className="btn btn-sm" type="submit" value="update" style={{color:" #fff", backgroundColor: "#e74c3c", borderColor: "#e74c3c"}}>Update</button>
                            </div> */}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </td>
        <td className="align-middle">
            <div className="button_quantity">
                <input className="minus is-form" type="button" value="-" name="minus" onClick={(e)=>handleChangeQuantity(e)}/>
                <input className="input-qty" min="1" max={listProduct.totalQty} name="quantity" type="number" value={listUpdate.quantity}/>
                <input className="plus is-form" type="button" value="+" name="plus" onClick={(e)=>handleChangeQuantity(e)}/>
            </div>
        </td>
        <td className="align-middle">{listProduct.discountPer ? new Intl.NumberFormat().format(listProduct.discount) : new Intl.NumberFormat().format(listProduct.price)}đ<del className="card-price-old">{listProduct.discountPer ? listProduct.price+'đ' : ''}</del></td>
        <td className="align-middle">{listProduct.discountPer ? new Intl.NumberFormat().format(parseInt(listProduct.discount * listUpdate.quantity)) :new Intl.NumberFormat().format(parseInt(listProduct.price * listUpdate.quantity))}đ</td>
        <td className="align-middle text-center" style={{cursor:"pointer"}}>
            <b>
                <i onClick={()=>{handleDeleteCart(props.id)}} className="fa-solid fa-trash-can text-danger me-2"></i>
            </b>
        </td>
        </>
    )
}
export default CartItem;