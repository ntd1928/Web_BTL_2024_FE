import { useState,useEffect } from "react";
import { getAllProducts } from "../../../services/productService";
import {IMG_URL} from '../../../config/imgUrl';
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import ProductPhoto from "./ProductPhoto";
import Pagination from "../../../pagination";
// import { getAllCategories } from "../../../services/categoryService";

const Product= ()=>{
    const [arrProducts,setArrProducts]=useState([]);
    // const [color,setColor]=useState([]);
    // const [arrCategory,setArrCategory]=useState([]);

    // const [searchInput, setSearchInput] = useState('');
    // const [keyword,setKeyword]=useState('');
    // const [pagProduct,setPagProduct]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(20);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);

    // useEffect(()=>{
    //     const getAllCategoriesFromReact = async()=>{
    //         const list = await getAllCategories('ALL');
    //         if(list && list.data.errCode === 0){
    //             setArrCategory(list.data.categories);
    //         }
    //     }
    //     getAllCategoriesFromReact();
    // },[]);
    // useEffect(()=>{
    //     const getAllColorsFromReact = async()=>{
    //         let data = await getAllColors('ALL');
            
    //         if(data && data.data.errCode === 0){
    //             setColor(data.data.colors);
    //         }
    //     }
    //     getAllColorsFromReact();
    // },[])

    useEffect(()=>{
        getAllProductsFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllProductsFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllProducts('ALL');
        if(response && response.data.errCode === 0){
            var tdata = response.data.products;
            var slice = tdata.slice(offset, offset + perPage)
            setPageCount(Math.ceil(tdata.length / perPage));
            // setPagProduct(tdata);
            setArrProducts(slice);
            setIsLoaded(true);
        }
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };

    // const loadMoreData = ()=> {
    //     const data = pagProduct;
    //     const slice = data.slice(offset, offset + perPage)
    //     setPageCount(Math.ceil(data.length / perPage));
    //     setArrProducts(slice);
    // }
    // const searchData = (e)=>{
    //     e.preventDefault();
    //     setPage(0);
    //     setKeyword(searchInput);
    // }

    // const [isShowSort,setIsShowSort]=useState(true);
    // const handleShowSort = ()=>{
    //     setIsShowSort(!isShowSort);
    // }
    const compare = (a, b, ascendingOrder) => {
       
        if (a < b) {
          return ascendingOrder ? -1 : 1;
        }
        if (a > b) {
          return ascendingOrder ? 1 : -1;
        }
        return 0;
      }
      
      const handleChange = (value) => {
        if(value === 'none'){
            setArrProducts([...arrProducts])
        } else {
          let toType, toAscending
          switch(value){
            case 'ascending' : toType = true; toAscending = true; break;
            case 'descending' : toType = true; toAscending = false; break;
            case 'high' : toType = false; toAscending = true; break;
            case 'low' : toType = false; toAscending = false; break;
            default:
          }
          let current = [...arrProducts]
          current.sort((a, b) => toType ?
                 compare(a.name, b.name, toAscending) 
                 : 
                 compare(a.price, b.price, toAscending))
          setArrProducts([...current])
        }
      }
    return(
        <div className="products-content">
            <div className="breadcrumb_background_sp">
                <h1 className="title_bg">Product</h1>
                <div className="overlay"></div>
            </div>
            <div className="row py-3 px-4">
                {/* <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                    <div className="card border mb-3">
                        <h5 className="card-header" onClick={handleShowSort}>Filter
                        
                        </h5>
                        <div className="card-body text-dark" style={{display:isShowSort ? "block" : "none" }}>
                            <div className="text-end">
                            <button class="btn btn-primary">Sort</button>
                           </div>
                            <div className="">
                                <div className="layered_subtitle dropdown-filter">
                                    <span>Product Category</span>
                                    <span className="icon-control">
                                        <i className="fa-solid fa-minus"></i>
                                    </span>
                                </div>
                                <div className="row">
                                    {arrCategory && arrCategory.map((item)=>{
                                        return(
                                            <div className="mb-2" href="sa" key={item.id}>{item.name}</div>
                                        )
                                    })}
                                    
                                </div>
                            </div>
                            <div className="">
                                <div className="layered_subtitle dropdown-filter">
                                    <span>Price</span>
                                    <span className="icon-control">
                                        <i className="fa-solid fa-minus"></i>
                                    </span>
                                </div>
                                <div className="price">
                                    <div className="form-check ">
                                        <input className="form-check-input me-2" type="checkbox" id="inlineCheckbox1" value="(<1000000)" />
                                        <label className="form-check-label" htmlFor="inlineCheckbox1">Dưới 10,000,000₫</label>
                                    </div>
                                    <div className="form-check ">
                                        <input className="form-check-input me-2" type="checkbox" id="inlineCheckbox2" value="(>=1000000 AND <=1500000)" />
                                        <label className="form-check-label" htmlFor="inlineCheckbox2">10,000,000₫ - 15,000,000₫</label>
                                    </div>
                                    <div className="form-check ">
                                        <input className="form-check-input me-2" type="checkbox" id="inlineCheckbox3" value="(>=1500000 AND <=2000000)" />
                                        <label className="form-check-label" htmlFor="inlineCheckbox3">15,000,000₫ - 20,000,000₫</label>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="layered_subtitle dropdown-filter">
                                    <span>color</span>
                                    <span className="icon-control">
                                        <i className="fa-solid fa-minus"></i>
                                    </span>
                                </div>
                                <div className="color">
                                {color && color.map((color)=>{
                                    return(
                                        <div className="form-check form-check-inline" key={color.id}>
                                            <input className="form-check-input" style={{backgroundColor:color.code}} name="color" type="checkbox" value={color.id} title={color.name} />
                                        </div>
                                    )
                                })
                                }
                                </div>
                            </div>
                           
                           
                        </div>
                    </div>
                </div> */}
                <div className="col" >
                    <div className="row align-items-center justify-content-between">
                        <h4 className="py-3 col-8 text-xxl-start text-xl-start text-lg-start text-md-center text-sm-center text-xs-center text-center">All Product</h4>
                        <div className="col-3">
                            <form action="" >
                                <select name="sort" className="form-select" onChange={(e) => handleChange(e.target.value)}>
                                    <option value="none">Sort by</option>
                                    <option value="low">Price (High to Low)</option>
                                    <option value="high">Price (Low to High)</option>
                                    <option value="descending">Name (Z to A)</option>
                                    <option value="ascending">Name (A to Z)</option>
                                </select>
                            </form>
                        </div>
                    </div>
                    <div className="row justify-content-between py-4">
                        {isloaded ? arrProducts && arrProducts.map((product)=>{
                        
                            return product.hidden === 0 && (
                                <div className="col-lg-2 col-ms-4 col-sm-6 col-6" key={product.id}>
                                    <div className="product-img">
                                    {product.discountPer ? 
                                        <div className="sale">
                                            <span>{product.discountPer + '%'}</span>
                                        </div>
                                        : ''}
                                        <Link to={`detail/${product.slug}/${product.id}`}  className="change">
                                            <img src={`${IMG_URL}/${product.photo}`} alt={product.name} className="img-fluid"/>
                                            <ProductPhoto productId={product.id} IMG_URL={IMG_URL} />
                                        </Link>
                                    </div>
                                    <div className="product-title">
                                        <Link to={`detail/${product.slug}/${product.id}`}>{product.name}</Link>
                                        <p>{new Intl.NumberFormat().format(product.price)}đ <del className="card-price-old">{product.discount ? product.discount+'đ' : ''}</del></p>
                                    </div>
                                </div>
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
                    </div>
                    {isloaded &&
                        <Pagination handlePageClick={handlePageClick} currentPage={currentPage} pageCount={pageCount} />
                    }
                </div>
            </div>
            
            {/* <PaginatedItems limit={4} /> */}
        </div>
        
    )
}
export default Product;