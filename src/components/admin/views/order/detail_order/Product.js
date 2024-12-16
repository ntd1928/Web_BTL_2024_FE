import { useEffect, useState } from "react";
import { getAllProducts } from "../../../../services/productService";
import { IMG_URL } from "../../../../config/imgUrl";

const Product =(props)=>{
    
    
    const [product,setProduct]=useState({});

    useEffect(()=>{
        const getProductFromReact = async()=>{
            const res = await getAllProducts(props.id);
            if(res && res.data.errCode === 0){
                console.log(res)
                setProduct(res.data.products);
            }   
        }
        getProductFromReact();
    },[props.id])

    return(
        <div class="d-flex mb-2">
            <div class="flex-shrink-0">
            <img src={`${IMG_URL}/${product.photo}`} alt={product.name} width="80" class="img-fluid" />
            </div>
            <div class="flex-lg-grow-1 ms-3">
            <h6 class="small mb-0"><a href="sdd" class="text-reset">{product.name}</a></h6>
            <span class="small">Color: <i class="fa-solid fa-circle" style={{color:props.color}}></i></span>
            </div>
        </div>
    )
}
export default Product;