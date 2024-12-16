import { useEffect, useState } from "react";
import { getAllProducts } from "../../../../services/productService";

const Product = (props)=>{
    const [product,setProduct]=useState({});
    
    useEffect(()=>{
        const getProductFromReact = async()=>{
            const res = await getAllProducts(props.productId);
            if(res && res.data.errCode===0){
                setProduct(res.data.products);
            }
        }
        getProductFromReact()
    },[props.productId]);
    return(
        <td className='text-center align-middle'>{product.name}</td>
    )
}
export default Product;