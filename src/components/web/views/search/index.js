import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllProductsSearch } from "../../../services/productService";
import ProductPhoto from "../product/ProductPhoto";
import { IMG_URL } from "../../../config/imgUrl";

const Search = ()=>{
    const { search } = useLocation();
const searchParams = new URLSearchParams(search);
const searchQuery = searchParams.get('search');
const [listSearch,setListSearch]=useState([]);
console.log(searchQuery);
useEffect(()=>{
    getProductsFromReact();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[searchQuery]);
const getProductsFromReact = async ()=>{
    var res = await getAllProductsSearch(searchQuery);
    if(res && res.data.errCode === 0){

        setListSearch(res.data.products);
    }
}

    return(
        <>
        <hr />
            <div className="container">
            <p style={{fontSize:"20px"}}>{listSearch.length} search results for <b>"{searchQuery}"</b></p>
            <div className="row justify-content-center">
                {listSearch && listSearch.map((item)=>(
                    <div className="col-lg-3 col-ms-6 col-sm-6 col-6" key={item.id}>
                        <div className="product-img">
                            {item.discountPer ? 
                                <div className="sale">
                                    <span>12%</span>
                                </div>
                                :
                                ''
                            }
                            <Link to={`/product/detail/${item.slug}/${item.id}`}  className="change">
                                        <img src={`${IMG_URL}/${item.photo}`} alt={item.name} className="img-fluid"/>
                                        <ProductPhoto productId={item.id} IMG_URL={IMG_URL} />
                                    </Link>
                        </div>
                        <div className="product-title">
                            <Link to={`/product/detail/${item.slug}/${item.id}`}>{item.name}</Link>
                            <p>{new Intl.NumberFormat().format(item.price)}đ <del className="card-price-old">{item.discount ? item.discount+'đ' : ''}</del></p>
                        </div>
                    </div>
                    )
                )}
                
            </div>
        </div>
        </>
    )
}
export default Search;