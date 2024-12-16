import { getAllProducts } from "../../../../services/productService";
import { useState,useEffect } from "react";
import { IMG_URL } from "../../../../config/imgUrl";
const ProductOrder = (props)=>{
    const id = props.idPro;
    const [product,setProduct]=useState({});
    useEffect(()=>{
        const getProductFromReact = async()=>{
            const list = await getAllProducts(id);
            if(list && list.data.errCode === 0){
                setProduct(list.data.products);
                
            }
        }
        getProductFromReact();
    },[id]);
    return(
        <div className="row justify-content-center align-items-center">
            <div className="col-md-3">
            <img src={`${IMG_URL}/${product.photo}`} alt={product.name} className="img-fluid"/>
            </div>
            <div className="col-md-9">
            <span>{product.name}</span>
            <p className="m-0 text-muted">Color: <i style={{color:props.color}} class="fa-solid fa-circle"></i></p>
            </div>
        </div>
    )
}
export default ProductOrder;