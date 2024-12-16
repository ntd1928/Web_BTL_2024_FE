import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
import '../../../../styles/Login.css';
import { deleteProductService, getAllProducts } from '../../../../services/productService';
import SelectCategory from "../../category/SelectCategory";
import { IMG_URL } from '../../../../config/imgUrl';
import {ThreeDots} from 'react-loader-spinner';
import Pagination from '../../../../pagination';
import Swal from 'sweetalert2';
import ModalDetailProduct from '../ModalDetailProduct';
// import ReactSearchBox from "react-search-box";

// const Arrays = (data, fieldId, fieldName) => {
//     let arrayItem = [];
//     if (data && Array.isArray(data)) {
//         data.map((item, key) => {
//             arrayItem.push({ key: item[fieldId], value: item[fieldName] });
//             return null;
//         });
//     }
//     return arrayItem;
// };

const ListProduct =()=> {

    const [arrProducts,setArrProducts]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);
    const [productData,setProductData]=useState([]);
    const [isOpenModalDetailProduct,setIsOpenModalDetailProduct]=useState(false);

    // const handleShowDetail = ()=>{
    //     setShowDetail(!showDetail);
    // }
   
   
    useEffect(()=>{
        getAllProductsFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllProductsFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllProducts('ALL');
        if(response && response.data.errCode === 0){
            setProductData(response.data.products)
            pagination(response.data.products);
        }
    }
    const pagination = (tdata)=>{
        var slice = tdata.slice(offset, offset + perPage)
            setPageCount(Math.ceil(tdata.length / perPage));
            // setPagProduct(tdata);
            setArrProducts(slice);
            setIsLoaded(true);
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };

    // const handleSearch = async(e)=>{
    //     e.preventDefault();
    //     let list = await getAllProducts('ALL');
    //     if(list && list.data.errCode === 0){
    //         setArrProducts(arrProducts);
    //     }

    // }
    // const handleReset = ()=>{

    // }
    // const handlePageClick = (e) => {
    //     const selectedPage = e.selected;
    //     const offset = selectedPage * perPage;
    //     setOffset(offset);
    //     loadMoreData();
    // };

    // const loadMoreData=()=> {
    //     const data = orgtableData;
    //     const slice = data.slice(offset, offset + perPage);
    //     setPageCount(Math.ceil(data.length/perPage))
    //     setArrProducts(slice);
    // }


    // const createNewProduct = async(data) => {
    //     try {
    //         let response = await createNewProductService(data);
    //         if(response && response.data.errCode !== 0){
    //             alert(response.data.errMessage);
    //         }else{
    //             await getAllProductsFromReact();
    //             setIsOpenModalProduct(false)
    //             emitter.emit('EVENT_CLEAR_MODAL_DATA');
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
        
    // }
    
    const handleDeleteProduct= async(product)=>{
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
                    let res = await deleteProductService(product.id);
                    if(res && res.data.errCode === 0){
                        await getAllProductsFromReact();
                    }else{
                        alert(res.data.errMessage)
                    }
                } catch (error) {
                    console.log(error)
                }
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
          })
    }
    const [product,setProduct]=useState({});
    const handleShowDetail = (product)=>{
        setIsOpenModalDetailProduct(true);
        setProduct(product);

    }
    const toggleDetailProductModal = () => {
        setIsOpenModalDetailProduct(!isOpenModalDetailProduct);

    }
    const handleSelectCategory=async(categoryId)=>{
        if(categoryId){
            const search = productData.filter(item => (item.categoryId === categoryId));
            setArrProducts(search);
            pagination(search);
        }
    }
    const [filterParam, setFilterParam] = useState('');

    const handleFilter = async(e)=>{
        setFilterParam(e.target.value);
        if(e.target.value===''){
            setArrProducts(productData);
        }else{
            const search = productData.filter(item => (item.name.toLowerCase().includes(e.target.value.toLowerCase())));
            setArrProducts(search);
        }
    }
   
    
    return (
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Product</h3>
                </div>
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                <li className="breadcrumb-item active">Product</li>
            </ol>
            {isOpenModalDetailProduct&&
                <ModalDetailProduct
                    isOpen = {isOpenModalDetailProduct}
                    toggleFromParent = {toggleDetailProductModal}
                    product={product}
                />
            }
            <div className='form-container mt-4'>
                <h4 className='text-center form-title'>List Of Products</h4>
                <div className='form-body'>
                    
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'>
                            <div className='d-flex align-items-center'>
                            <b className='me-2'>Category: </b>
                            <SelectCategory onSelected={handleSelectCategory}/>
                            </div>
                            <div class="search ms-3" htmlFor="search">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <input className="form-control" id="search" type="text" value={filterParam}
                                    onChange={(e) => handleFilter(e)} placeholder="Search name..." />
                            </div>
                        </div>
                        <div className='d-flex'>
                            <div className='mx-2'>
                                <a href='/admin/add-product'><button className='btn add-product'><i class="fa-solid fa-plus me-2"></i>Add</button></a>
                            </div>
                        </div>
                    </div>
                   
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    {/* <th className='text-center align-middle form-title'>Mã</th> */}
                                    <th className='text-center align-middle form-title col-3'>Name</th>
                                    <th className='text-center align-middle form-title col-1'>Photo</th>
                                    <th className='text-center align-middle form-title'>Price</th>
                                    <th className='text-center align-middle form-title'>Discount</th>
                                    <th className='text-center align-middle form-title'>Quantity</th>
                                    <th className='text-center align-middle form-title'>Hidden</th>
                                    <th className='text-center align-middle form-title'>New Arrival</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {isloaded ? 
                                arrProducts && arrProducts.map((product,index)=>{
                                    return(
                                        <tr key={product.id}>
                                            <td className='text-center align-middle'>{index+1}</td>
                                            {/* <td className='text-center align-middle'>{product.id}</td> */}
                                            <td className='text-center align-middle'>{product.name}</td>
                                            <td className='text-center align-middle'>
                                                <img src={`${IMG_URL}/${product.photo}`} alt={product.name} className="img-fluid" />
                                            </td>
                                            <td className='text-center align-middle'>{product.price}</td>
                                            <td className='text-center align-middle'>{product.discount !== 0 ? product.discount : '' }</td>
                                            <td className='text-center align-middle'>{product.totalQty}</td>
                                            <td className='text-center align-middle'>
                                                {product.hidden===0 ?
                                                    <span><i className="fa-solid fa-xmark text-danger"></i> No</span>
                                                :
                                                    <span><i className="fa-solid fa-check text-success"></i> Yes</span>
                                                }
                                                
                                            </td>
                                            <td className='text-center align-middle'>
                                                {product.newArrival===0 ?
                                                    <span><i className="fa-solid fa-xmark text-danger"></i> No</span>
                                                :
                                                    <span><i className="fa-solid fa-check text-success"></i> Yes</span>
                                                }
                                            </td>
                                            <td className='text-center align-middle'>
                                                <span className="hover-icon text-warning me-3" onClick={()=>handleShowDetail(product)} alt="Detail">
                                                        <i class="fa-solid fa-circle-info"></i>
                                                </span>
                                                <Link to={`/admin/edit-product/${product.id}`} alt="Edit">
                                                    <span className="hover-icon text-success">
                                                        <i className="fa-solid fa-pen-to-square me-3"></i>
                                                    </span>
                                                </Link>
                                                <span onClick={()=>handleDeleteProduct(product)} className="hover-icon text-danger" alt="Delete">
                                                    <i className="fa-solid fa-trash"></i>
                                                </span>
                                               
                                            </td>
                                        </tr>
                                        
                                    )
                                })
                                : 
                                <ThreeDots 
                                    height="60" 
                                    width="60" 
                                    radius="9"
                                    color="#FF6600" 
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                    />
                                }
                            </tbody>
                        </table>
                        
                    </div>
                    
                    {isloaded &&
                        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} currentPage={currentPage} />
                    }
                </div>
            </div>
            
        </div>

    )
}

export default ListProduct;