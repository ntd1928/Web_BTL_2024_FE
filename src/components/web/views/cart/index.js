import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAllCart, getCartByUserId, setOder } from '../../../services/cartService';
import CartItem from './CartItem';
import { getUserByEmail } from '../../../services/userService';
import Swal from 'sweetalert2';
import { getAllProducts } from '../../../services/productService';
const Cart = ()=>{

    const [listCart,setListCart]=useState([]);
    const [userId,setUserId]= useState('');
    const [total,setTotal]=useState(0);
    const [price,setPrice]=useState([]);

    useEffect(()=>{
        getCartFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const getCartFromReact = async()=>{
        let email = localStorage.getItem('email')
        if (email) {
            let user = await getUserByEmail(email);
            if (user && user.data.errCode === 0) {
                setUserId(user.data.user.id)
                let list = await getCartByUserId(user.data.user.id);
                if(list && list.data.errCode === 0){
                    console.log('cart',list.data.carts);
                    setListCart(list.data.carts);
                    getTotal(list.data.carts);
                }
            }
        }
    }
    const getTotal = async(data)=>{
        let tt = 0;
        let priceTotal = 0;
        for(let i=0;i<data.length;i++){
            let product = await getAllProducts(data[i].productId);
            if(product && product.data.errCode===0){
                if(product.data.products.discountPer !== 0){
                    setPrice((prevState) => [...prevState,{
                        quantity:data[i].quantity,
                        price: product.data.products.discount,
                        productId: product.data.products.id,
                        color:data[i].color
            
                    }]);
                    priceTotal = parseInt(product.data.products.discount);
                }
                if(product.data.products.discountPer === 0){
                    setPrice((prevState) => [...prevState,{
                        quantity:data[i].quantity,
                        price: product.data.products.price,
                        productId: product.data.products.id,
                        color:data[i].color
            
                    }]);
                    priceTotal = parseInt(product.data.products.price);
                }                
            }
        
        tt += priceTotal *parseInt(data[i].quantity);
        }
        setTotal(tt);
    }
    const handleDeleteAllCart= (id)=>{
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
                    let res = await deleteAllCart(id);
                    if(res && res.data.errCode === 0){
                        Swal.fire(
                            'Deleted!',
                            res.data.errMessage,
                            'success'
                        )
                    await getCartFromReact();
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
    const handleCheckOut = async(qty,tt,list)=>{
        console.log(qty,tt,list);
        const data = {
            quantity:qty,
            grandTotal:tt,
            list:list
        }
            await setOder(data);
            window.location.href = "checkout";
       
        
    }
    return(
        <>
        <hr/>
        <div className="container p-4">
            <div className="cart">
                <div className='text-danger text-end'>
                    <b onClick={()=>handleDeleteAllCart(userId)} style={{cursor:"pointer"}}><i class="fa-solid fa-trash-can"></i> Remove All</b>
                </div>
                <div className="cart-title text-center">
                    Shopping Cart
                </div>
                <div className="cart-content">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="align-middle text-center form-title col-4">Item</th>
                                    <th className="align-middle text-center form-title col-2">Color</th>
                                    <th className="align-middle text-center form-title">Quantity</th>
                                    <th className="align-middle text-center form-title">Price</th>
                                    <th className="align-middle text-center form-title">Price total</th>
                                    <th className="align-middle text-center form-title">Action</th>
                                    {/* <th className="align-middle form-title" style={{fontSize:"14px"}}>PRICE</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {listCart ? listCart.map(item=>(
                                    <tr key={item.id}>
                                    <CartItem id={item.id} productId={item.productId} quantity={item.quantity} code={item.color} userId={userId}/>
                                    </tr>
                                )
                                )
                                :
                                <p>Empty Cart</p>
                                }
                                <tr className='text-end'>
                                    <td colSpan="6" className="align-middle">
                                        <div className='mt-2 mb-3' style={{color:"rgba(0,0,0,.54)"}}>Sub Total: <b className='text-danger'>{new Intl.NumberFormat().format(total)}đ</b></div>
                                        <div className='mb-3' style={{color:"rgba(0,0,0,.54)"}}>Shipping: <b className='text-danger'>0đ (Free)</b></div>
                                        <h5><b>Grand Total: </b><b className='text-danger'>{new Intl.NumberFormat().format(total)}đ</b></h5>
                                    </td>
                                </tr>
                              
                            </tbody>
                        </table>
                        <div className='d-flex justify-content-between'>
                            <div className='me-3'>
                                <button className='btn btn-success'><Link to="/product" className='text-white'>Continue shopping</Link></button>
                            </div>
                            <div>
                                <button className='btn' style={{backgroundColor:"#e74c3c",color:"#ffffff"}} onClick={()=>handleCheckOut(listCart.length,total,price)}>
                                    Proceed to checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

export default Cart;