import { useState } from "react";
import { Button } from "reactstrap";
import swal from 'sweetalert2';
import ImageUploading from 'react-images-uploading';
import { createNewProductPhotoService, createNewProductService } from "../../../../services/productService";
import RichTextEditor from "../../RichTextEditor";
import SelectColor from "../../product-color/SelectColor";
import SelectCategory from "../../category/SelectCategory";
import { Link } from "react-router-dom";

const AddProduct =()=>{

    const [arrInput,setArrProduct]=useState({
        name: '',photo:'',price:'',discount:'',discountPer:'',totalQty:'',slug:'',content:'',hidden:'',newArrival:'',categoryId:''
    });
    const [urlPhoto,setUrlPhoto]=useState({
        imagePreview:''
    });

    const maxNumber = 69;

    const [listDetail,setListDetail]=useState([{ colorId: '', qtyProduct:'' }]);

    const [images,setImages]=useState('');

    const handleOnChange=(e)=>{
        const {name,value}= e.target;
        setArrProduct({...arrInput,[name]:value})
    }
    const handleChangeImage = (e)=>{
        const name = e.target.name;
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
              setUrlPhoto(
                {
                    ...urlPhoto,imagePreview: reader.result,
              });
              setArrProduct(
                {
                    ...arrInput,[name]:file
              });
            };
            reader.readAsDataURL(file);
          }
       
    }
    const handleContentChange = contentHtml => {
        setArrProduct({...arrInput,content:contentHtml})
    };
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    const handleSubmitColor = (list)=>{
        setListDetail(list);
    }
    const handleOnChangeDetail = (e, index) => {
        const { name, value } = e.target;
        const list = [...listDetail];
        list[index][name] = value;
        setListDetail(list);
    };

    const handleAddColor = () => {
        setListDetail([...listDetail, { colorId: '',qtyProduct:'' }]);
    };

    const handleRemoveColor = (index) => {
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                const list = [...listDetail];
                list.splice(index, 1);
                setListDetail(list);
                swal.fire(
                    'Deleted!',
                    'Your color has been deleted.',
                    'success'
              )
            }
          })
        
    };

    const handleSelectCategory = (value)=>{
        setArrProduct({
            ...arrInput,categoryId:value
        })

    }
    
    const formValidProduct = ({ ...rest }) => {
        console.log(rest)
        let valid = true;
        if(rest.name === ''&&rest.photo === '' && rest.totalQty=== '' 
                && rest.price === '' && rest.categoryId==='' && rest.slug === '' 
                && rest.content === ''){
                valid = false; 
            }
        return valid;
    };
    
    const formValidDetailColor = ([...rest])=>{
        let valid = true;
        for(let i=0;i<rest.length;i++){
            if(rest[i].colorId === '' && rest[i].qtyProduct === ''){
                valid=false;
            }
        }
        return valid;
    }
    const formValidProductPhoto = ({...rest})=>{
        console.log(rest)
        let valid = true;
        if(Object.keys(rest).length === 0){
            valid=false;
        }
        return valid;
    }
    const handleAddNewProduct = ()=>{
        const {name,photo,price,discount,discountPer,totalQty,slug,content,hidden,newArrival,categoryId}=arrInput;
        const formDataProduct = new FormData();
        formDataProduct.append('name',name)
        formDataProduct.append('photo',photo)
        formDataProduct.append('price',price)
        formDataProduct.append('discount',discount)
        formDataProduct.append('discountPer',discountPer)
        formDataProduct.append('totalQty',totalQty)
        formDataProduct.append('slug',slug)
        formDataProduct.append('content',content)
        formDataProduct.append('hidden',hidden)
        formDataProduct.append('newArrival',newArrival)
        formDataProduct.append('categoryId',categoryId);
        formDataProduct.append(`detailProduct`, JSON.stringify(listDetail));
        if(formValidProduct(arrInput) && formValidDetailColor(listDetail) && formValidProductPhoto(images)){
            let total=0;
            for(let i = 0;i<listDetail.length;i++){
                total += parseInt(listDetail[i].qtyProduct);
            }
            if(total === parseInt(totalQty)){
                swal.fire({
                    title: 'Are you sure?',
                    text: "You want to Add New Product?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Add!'
                  }).then(async(result) => {
                    if (result.isConfirmed) {
                        let list = await createNewProductService(formDataProduct);
                        if(list.data && list.data.errCode !== 0 ){
                            swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: list.data.message,
                                })
                        }
                        if(list.data && list.data.errCode === 0 ){
                            const formDataProductPhoto = new FormData();
                            formDataProductPhoto.append('productName',name)
                            for(let i=0;i<images.length;i++){
                                formDataProductPhoto.append('productphoto',images[i].file)
                            }
                            // add galleries
                            let listProductPhoto = await createNewProductPhotoService(formDataProductPhoto);
                            if(listProductPhoto.data && listProductPhoto.data.errCode !== 0){
                                swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: listProductPhoto.data.message,
                                })
                            }
                            if(listProductPhoto.data && listProductPhoto.data.errCode === 0){
                                swal.fire(
                                    'Add product!',
                                    'Your product has been added.',
                                    'success'
                                )
                                window.location.href = "/admin/list-product"
                            }
                        }
                    }
                  })
            }else{
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please check your quantity product of colors!',
                  })
            }
            
        }else{
            swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please check your input!',
              })
        }

    }
    
    return(
        <div className="mb-4">
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Product</h3>
                </div>
                {/* <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={(e) => this.handleBack()}><i className="fas fa-arrow-left" /> Back</Button>
                </div> */}
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="/admin/product/create">Product</a></li>
                <li className="breadcrumb-item active">Create A New Product</li>
            </ol>
            <div className="row">
                <div className="text-end">
                    <Button style={{backgroundColor:"#5046e5"}} className="me-3 px-4" onClick={handleAddNewProduct}>Create</Button>
                    </div>
                <div className="col-md-8">
                    <div className="form-container mt-4">
                        <h5 className="form-title">Basic information</h5>
                        <div className="row form-body" >
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Name<b className="text-danger">*</b>:</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={arrInput.name}
                                    name="name" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                            
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Category<b className="text-danger">*</b>:</label>
                                <SelectCategory onSelected={handleSelectCategory}/>
                            </div>
                           
                            <div className="col-12 mb-3">
                                <label className="form-label">Slug<b className="text-danger">*</b>:</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={arrInput.slug}
                                    name="slug" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                        

                            <div class="col-12 mb-3">
                                <label className="form-label">Photo<b className="text-danger">*</b>:</label>
                                <input 
                                    className="form-control" 
                                    type="file" 
                                    name="photo"
                                    onChange={(event)=> handleChangeImage(event)}
                                    />
                                {urlPhoto.imagePreview &&
                                    <img src={urlPhoto.imagePreview} 
                                        alt="photos" 
                                        className="img-fluid" 
                                        style={{
                                            margin: "10px",
                                            width: "200px",
                                            height: "200px"
                                            }}/>
                                }
                            </div>
                            
                            <div className="col-12 mb-3">
                                <label className="form-label">Product Photo:</label>
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
                                                <img src={image['data_url']} alt="" width="150" className="my-3" />
                                                <button className="btn-remove" onClick={() => onImageRemove(index)}><i class="fa-solid fa-minus"></i></button>
                                                <button className="btn-update" onClick={() => onImageUpdate(index)}><i class="fa-regular fa-pen-to-square"></i></button>
                                            </div>                                        
                                        ))}

                                        </div>
                                    </div>
                                    )}
                                </ImageUploading>
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Product Content<b className="text-danger">*</b>:</label>
                                <RichTextEditor 
                                    content={arrInput.content}
                                    handleContentChange={handleContentChange}
                                    placeholder="..."                            
                                    // boolean={readOnlyEditor}
                                />
                            </div>
                        </div>
                        
                    </div>
                    <div className="form-container mt-4">
                    <h5 className="form-title">Visible Product and New Arrival</h5>
                        <div className="row form-body">
                            <div className="col-md-6">
                                <label className="form-label">Hidden:</label>
                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="hidden" name="hidden" checked={arrInput.hidden} 
                                        onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.checked,
                                            },
                                            });
                                        }} 

                                        />
                                    <label className="form-check-label" htmlFor="hidden">Hidden</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">New Arrival:</label>
                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="newArrival" name="newArrival" checked={arrInput.newArrival} 
                                        onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.checked,
                                            },
                                            });
                                        }} 
                                    />
                                    <label className="form-check-label" htmlFor="newArrival">New Arrival</label>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-container mt-4">
                                <h5 className="form-title">Price information</h5>
                                <div className="row form-body">
                                    <div className="col-12 mb-3">
                                        <label className="form-label">Price<b className="text-danger">*</b>:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={arrInput.price} 
                                            minLength={8} 
                                            name="price" 
                                            required 
                                            onChange={(event) => handleOnChange(event)} 
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label">Discount:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            value={arrInput.discount} 
                                            minLength={8} 
                                            name="discount" 
                                            required 
                                            onChange={(event) => handleOnChange(event)} 
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label">Discount Percent:</label>
                                        <div className="input-group">
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                required 
                                                value={arrInput.discountPer} 
                                                name="discountPer"
                                                onChange={(event) => handleOnChange(event)}
                                            />
                                            <span class="input-group-text text-danger"><b>%</b></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="form-container mt-4">
                                <h5 className="form-title">Quantity information</h5>
                                <div className="row form-body">
                                    <div className="col-12 mb-3">
                                        <label className="form-label">Quantity<b className="text-danger">*</b>:</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            required 
                                            value={arrInput.totalQty} 
                                            name="totalQty"
                                            onChange={(event) => handleOnChange(event)}
                                        />
                                    </div>
                                    {listDetail.map((item,index)=>(
                                        <div className="col-12 mb-3" key={index}>
                                            <div className="d-flex justify-content-between">
                                            <label className="form-label">Color<b className="text-danger">*</b>: </label>
                                            <Link to="/admin/color" style={{fontSize:"14px"}}>Add Color</Link>
                                            </div>
                                            <div className="d-flex algin-item-center mb-2">
                                                <div className="row">
                                                    <div className="col-12">
                                                    <SelectColor onChangeColor={handleSubmitColor} index={index} listDetail={listDetail}/>
                                                    </div>
                                                    <div className="col-12 mt-2">
                                                        <label className="form-label">Quantity Product:</label>
                                                        <input type="number" name="qtyProduct" value={item.qtyProduct} className="form-control" onChange={(event)=>handleOnChangeDetail(event,index)}/>
                                                    </div>
                                                </div>
                                                {/* <input type="color" value={item.color} name="color" onChange={(event)=>handleOnChangeColor(event,index)} />
                                                <p className="mx-2" style={ { color: `${ item.color }`,margin:'0px' } }>{item.color}</p> */}
                                                {listDetail.length !== 1 && (
                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveColor(index)}
                                                            className="btn btn-primary ms-3"
                                                            >
                                                                <span>Remove</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {listDetail.length - 1 === index && listDetail.length < 4 && (
                                                <div className="col-12">
                                                    <button type="button" className="btn btn-primary" onClick={handleAddColor} >+ Add Detail</button>
                                                </div>
                                            )}
                                            
                                        </div>
                                        
                                            
                                    ))} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AddProduct;