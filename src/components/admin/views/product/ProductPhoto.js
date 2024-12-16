import { useEffect,useState } from "react";
import { getAllProductPhoto } from "../../../services/productService";
import ImageUploading from 'react-images-uploading';
import { IMG_URL } from "../../../config/imgUrl";
const ProductPhoto =(props)=>{

    const [images,setImages]=useState([]);
    const maxNumber = 69;

    useEffect(()=>{
        getProductPhotoFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.productId]);

    

    const getProductPhotoFromReact=async()=>{
        const productphoto = await getAllProductPhoto(props.productId);
            if(productphoto && productphoto.data.productphotos){
                for(let i=0;i<productphoto.data.productphotos.length;i++){
                    images.push(productphoto.data.productphotos[i].path)
                }
            }
    }
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    return(
        <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
        >
            {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
            }) => (
            // write your building UI
            <div className="upload__image-wrapper">
                <button className="btn-upload"
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                        >
                    <i class="fa-solid fa-upload"></i><br />
                    <b>Add images</b>
                </button>
                &nbsp;
                <button className="btn" onClick={onImageRemoveAll}><i class="fa-solid fa-delete-left"></i> Delete all images</button>
                <div className="row my-2 py-2">
                {imageList.map((image, index) => (
                    <div key={index} className="container-img col-3">
                    {image['data_url'] ?
                    <img src={image['data_url']} alt="" width="150" className="my-3" />
                    :
                    <img src={`${IMG_URL}/${image}`} alt="" width="150" className="my-3" />
                    }
                        <button className="btn-remove" onClick={() => onImageRemove(index)}><i class="fa-solid fa-minus"></i></button>
                        <button className="btn-update" onClick={() => onImageUpdate(index)}><i class="fa-regular fa-pen-to-square"></i></button>
                    </div>                                        
                ))}
                {/* {images && images.map((image, index) => (
                    <div key={index} className="container-img col-3">
                    {console.log(image)}
                        <img src={`${IMG_URL}/${image}`} alt="" width="150" className="my-3" />
                        <button className="btn-remove" onClick={() => onImageRemove(index)}><i class="fa-solid fa-minus"></i></button>
                        <button className="btn-update" onClick={() => onImageUpdate(index)}><i class="fa-regular fa-pen-to-square"></i></button>
                    </div>                                        
                ))} */}

                </div>
            </div>
            )}
        </ImageUploading>
    )
}
export default ProductPhoto;