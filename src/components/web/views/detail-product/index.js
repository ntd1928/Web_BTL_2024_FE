
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDetailProductService, getAllProductPhoto, getAllProducts } from '../../../services/productService';
import { IMG_URL } from '../../../config/imgUrl';
// import ProductPhoto from '../product/ProductPhoto';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Color from './Color';
import { addCart } from '../../../services/cartService';
import Swal from 'sweetalert2';
import { getUserByEmail } from '../../../services/userService';
import Feedback from './Feedback';

const DetailProduct = ()=>{
    const {id} = useParams();

    const [product,setProduct]=useState([]);
    // const [color,setColor]=useState([]);
    const [productphoto,setProductPhoto]=useState([]);
    const [detailproduct,setDetailProduct]=useState([])

    const [cart,setCart]=useState({
        quantity:1,color:'',productId:id,userId:'' 
    });

    
    useEffect(()=>{
        getAllProductFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id]);
   

    const getAllProductFromReact = async()=>{
        const list = await getAllProducts(id);
        if(list && list.data.errCode === 0){
            setProduct(list.data.products);
            const response = await getAllProductPhoto(id);
            if(response && response.data.errCode === 0){
                setProductPhoto(response.data.productphotos);
            }
            const data = await getDetailProductService(id);
            if(data && data.data.errCode === 0){
                setDetailProduct(data.data.detailproducts);
            }
        }
    }
    useEffect(()=>{
        getUserFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    const getUserFromReact = async()=>{
        let email = localStorage.getItem('email')
        if (email) {
            let user = await getUserByEmail(email);
            if (user && user.data.errCode === 0) {
                setCart({...cart,userId:user.data.user.id});
            }
        }
    }
    const formValid = ({ ...rest }) => {
        let valid = true;
        Object.values(rest).forEach(val => {
            val === '' && (valid = false);
        });
        return valid;
    }
    const getColor = (color)=>{
        setCart({...cart,color:color});
    }
    const handleChangeQuantity=(e)=>{
        if(e.target.name === "minus" && cart.quantity > 1){
            setCart({...cart,quantity:cart.quantity - 1})
        }
        if(e.target.name === "plus" && cart.quantity < product.totalQty){
            setCart({...cart,quantity:cart.quantity + 1})
        }
    }
    const addToCart = async()=>{
        const {quantity,color,productId,userId}=cart;
        const data = {quantity:quantity,color:color,productId:productId,userId:userId};
        if(formValid(cart)){
            Swal.fire({
                title: 'Are you sure?',
                text: "You want to Add New Product?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Add!'
              }).then(async(result)=>{
                if(result.isConfirmed){
                    console.log(data);
                    let add = await addCart(data);
                    if(add){
                        Swal.fire(
                            'Add product to cart!',
                            'Your product has been added to cart.',
                            'success'
                        )
                    }
                    window.location.href = "/cart";
                }
            })
        }else if(cart.color === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select color!',
              })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please login or register!',
              })
        }

    }
   
    return(
        <>
        <hr />
        <div className="container detail_product">
            <h2 className="py-4 text-center">Detail Product</h2>
            {/* <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="fdsf">Product</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Detail</li>
                </ol>
            </nav> */}
            <div className="row py-3">
                <div className="col-md-6 detail_product_img">
                   <div>
                   <Carousel showArrows={true}>
                        <div>
                            <img src={`${IMG_URL}/${product.photo}`} alt={product.name} />
                        </div>
                        {productphoto && productphoto.map((item)=>{
                            return(
                                <div key={item.id}>
                                    <img src={`${IMG_URL}/${item.path}`} alt="ProductPhoto" width="100px" />
                                </div>
                            )
                        })
                        }
                    </Carousel>
                   </div>
                </div>
                <div className="col-md-6 detail_product_content">
                    <div className='container'>
                    <h4>{product.name}</h4>
                    <h5 className='text-danger'>{product.discountPer ? new Intl.NumberFormat().format(product.discount):new Intl.NumberFormat().format(product.price)}đ <del className="card-price-old">{product.discountPer ? new Intl.NumberFormat().format(product.price): ''}</del></h5>
                    <hr/>
                    <div className='mt-3'>
                            <div>
                                <b>Color</b> <span className='text-muted'>({detailproduct.length})</span>
                            </div> 
                           <div className='d-flex align-items-center'>
                                {detailproduct && detailproduct.map((item,index)=>{
                                    
                                    return(
                                        <Color key={item.id} id={item.colorId} disabled={item.qtyProduct === 0 ? '1' : ''} getColor={getColor}/>
                                    )
                                })
                                }
                               
                           </div>
                            
                    </div>
                    <div className='mt-3'>
                        <p><b>Quantity</b></p>
                        <div className="button_quantity">
                            <input className="minus is-form" type="button" value="-" name = "minus" onClick={(e)=>handleChangeQuantity(e)}/>
                            <input aria-label="quantity" className="input-qty" min="1" max={product.totalQty} name="quantity" type="number" value={cart.quantity}/>
                            <input className="plus is-form" type="button" value="+" name="plus" onClick={(e)=>handleChangeQuantity(e)}/>
                            <p className="px-3 py-2 m-0 text-secondary" style={{fontSize:"14px"}}>
                                    {product.totalQty === 0 ?
                                        <p className='text-muted'>Sold Out</p>
                                        :
                                        product.totalQty
                                        } products</p><br />
                        </div>
                    </div>
                    <div className="mt-3">
                        <p><b>About product</b></p>
                        <p dangerouslySetInnerHTML={{__html: product.content}} class="ql-editor" />
                    </div>
                    
                    <hr/>
                    <div className='mb-5'>
                        <p><b>Shipping</b></p>
                        <i class="fa-solid fa-truck-fast"></i> <span className='text-muted'>Estimated shipping</span> : <b>Free (0 VND)</b>
                    </div>
                    <div className='col-12'>
                    <button className="btn_add_cart px-5" type="submit" name="addcart" onClick={addToCart}>Add To Cart</button>
                    </div>
                    </div>
                </div>
            </div>
            <hr />
            <Feedback productId={product.id}/>
        </div>
        </>
    )
}
export default DetailProduct;