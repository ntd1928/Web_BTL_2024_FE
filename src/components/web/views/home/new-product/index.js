import { useEffect, useState } from "react";
import { getAllProducts } from "../../../../services/productService";
import ProductPhoto from "../../product/ProductPhoto";
import { Link } from "react-router-dom";
import { IMG_URL } from "../../../../config/imgUrl";
const NewProduct = ()=>{
    const [product,setProduct]=useState([]);

    useEffect(()=>{
        const getProductFromReact = async()=>{
            const res = await getAllProducts('ALL');
            if(res && res.data.errCode === 0){
                setProduct(res.data.products);
            }
        }
        getProductFromReact();
    },[])
    return(
        <div className="container">
            <div className=" py-5 ">
                <h3 className="text-center">NEW PRODUCT</h3>
                <a href="all" className="all">See all<i className="fa-solid fa-angles-right"></i></a>
            </div>
            <div className="row justify-content-center">
                {product && product.map((item)=>{
                    return item.hidden === false && item.newArrival === true && (
                        <div className="col-lg-3 col-ms-6 col-sm-6 col-6">
                            <div className="product-img">
                                {item.discountPer ? 
                                    <div className="sale">
                                        <span>{item.discountPer + '%'}</span>
                                    </div>
                                      : ''}
                                <Link to={`detail/${item.slug}/${item.id}`}  className="change">
                                    <img src={`${IMG_URL}/${item.photo}`} alt={item.name} className="img-fluid"/>
                                    <ProductPhoto productId={item.id} IMG_URL={IMG_URL} />
                                </Link>
                            </div>
                            <div className="product-title">
                                    <Link to={`detail/${item.slug}/${item.id}`}>{item.name}</Link>
                                    <p>{new Intl.NumberFormat().format(item.price)}đ <del className="card-price-old">{item.discount ? item.discount+'đ' : ''}</del></p>
                                </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default NewProduct;