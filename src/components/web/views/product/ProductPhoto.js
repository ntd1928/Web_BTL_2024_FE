import { useEffect, useState } from "react";
import { getAllProductPhoto } from "../../../services/productService";
const ProductPhoto = (props)=>{
    const [productphoto,setProductPhoto]=useState([]);

    useEffect(()=>{
        getAllProductPhotoFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.productId]);

    const getAllProductPhotoFromReact = async()=>{
        const response = await getAllProductPhoto(props.productId);
        if(response && response.data.errCode === 0){
            setProductPhoto(response.data.productphotos);
        }
    }
    return (
        <>
            {productphoto && productphoto.map((item,index)=>{
                    if(index === 1){
                        return( 
                            <div key={item.id}>
                                <img src={`${props.IMG_URL}/${item.path}`} alt="ProductPhoto" className="img-fluid img-top"/>
                            </div>
                        )
                    }else{
                        return(
                            ''
                        )
                    }   
            })
            }
        </>
    )
}
export default ProductPhoto;