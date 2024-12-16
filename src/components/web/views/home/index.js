import { getAllProducts } from "../../../services/productService";
import ProductPhoto from "../product/ProductPhoto";
import Banner from "./banner";
import Carousels from "./carousel";
import NewProduct from "./new-product";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMG_URL } from "../../../config/imgUrl";
import banner from '../../../../assets/banner7.jpg';
const Home = () => {
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const getProductFromReact = async () => {
            const res = await getAllProducts('ALL');
            if (res && res.data.errCode === 0) {
                setProduct(res.data.products);
            }
        }
        getProductFromReact();
    }, [])
    return (
        <div>
            <Banner />
            <div className="pt-3 pb-5">
                <Carousels />
            </div>
            <img class="img-fluid" src={`${banner}`} alt="Banner quảng cáo"></img>
            {/* new */}
            <div className="container">
                <div className=" py-5 ">
                    <h3 className="text-center">NEW PRODUCT</h3>
                    <Link to="/product" className="all">See all <i className="fa-solid fa-angles-right"></i></Link>
                </div>
                <div className="row justify-content-center">
                    {product && product.map((item, index) => {
                        return item.hidden === 0 && item.newArrival === 1 && index < 8 && (
                            <div className="col-lg-3 col-ms-6 col-sm-6 col-6" key={item.id}>
                                <div className="product-img">
                                    {item.discountPer ?
                                        <div className="sale">
                                            <span>{item.discountPer + '%'}</span>
                                        </div>
                                        : ''}
                                    <Link to={`/product/detail/${item.slug}/${item.id}`} className="change">
                                        <img src={`${IMG_URL}/${item.photo}`} alt={item.name} className="img-fluid" />
                                        <ProductPhoto productId={item.id} IMG_URL={IMG_URL} />
                                    </Link>
                                </div>
                                <div className="product-title">
                                    <Link to={`/product/detail/${item.slug}/${item.id}`}>{item.name}</Link>
                                    <p>{new Intl.NumberFormat().format(item.price)}đ <del className="card-price-old">{item.discount ? item.discount + 'đ' : ''}</del></p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="row py-5 justify-content-center">
                <div className="col-4 img-hover-zoom img-hover-zoom--blur">
                    <img className="img-fluid" src="https://nhaxinh.com/wp-content/uploads/2021/11/miami-01.png" alt="" />
                    <div className="caption_banner">
                        <span className="subtitle">Thư giãn với</span>
                        <h3>Sofa</h3>
                        <Link className="button" to="/product">Xem ngay</Link>
                    </div>
                    <div className="overlay"></div>
                </div>
                <div className="col-4 img-hover-zoom img-hover-zoom--blur">
                    <img className="img-fluid" src="https://nhaxinh.com/wp-content/uploads/2021/10/phong-anmiami-xanh-new3.jpg" alt="" />
                    <div className="caption_banner">
                        <span className="subtitle">Thiết kết hiện đại</span>
                        <h3>Modern Furniture</h3>
                        <Link className="button" to="/product">Xem ngay</Link>
                    </div>
                    <div className="overlay"></div>
                </div>
                <div className="col-4 img-hover-zoom img-hover-zoom--blur">
                    <img className="img-fluid" src="https://nhaxinh.com/wp-content/uploads/2022/03/sofa-du-bai-kieu-dang-hien-dai-mau-nau-tram.jpg" alt="" />
                    <div className="caption_banner">
                        <span className="subtitle">Nội Thất Sang Trọng</span>
                        <h3>Phong Cách Hoàng Gia</h3>
                        <Link className="button" to="/product">Xem ngay</Link>
                    </div>
                    <div className="overlay"></div>
                </div>
            </div>
            {/* sale */}
            <div className="container">
                <div className=" py-5 ">
                    <h3 className="text-center">SALE PRODUCT</h3>
                    <Link to="/product" className="all">See all <i className="fa-solid fa-angles-right"></i></Link>
                </div>
                <div className="row justify-content-center">
                    {product && product.map((item, index) => {
                        return item.hidden === 0 && item.discountPer && index < 8 ? (
                            <div className="col-lg-3 col-ms-6 col-sm-6 col-6" key={item.id}>
                                <div className="product-img">
                                    {item.discountPer ?
                                        <div className="sale">
                                            <span>{item.discountPer + '%'}</span>
                                        </div>
                                        : ''}
                                    <Link to={`/product/detail/${item.slug}/${item.id}`} className="change">
                                        <img src={`${IMG_URL}/${item.photo}`} alt={item.name} className="img-fluid" />
                                        <ProductPhoto productId={item.id} IMG_URL={IMG_URL} />
                                    </Link>
                                </div>
                                <div className="product-title">
                                    <Link to={`/product/detail/${item.slug}/${item.id}`}>{item.name}</Link>
                                    <p>{new Intl.NumberFormat().format(item.price)}đ <del className="card-price-old">{item.discount ? item.discount + 'đ' : ''}</del></p>
                                </div>
                            </div>
                        )
                            :
                            (
                                ''
                            )
                    })}
                </div>
            </div>
            <div className="py-5 d-flex justify-content-center">
                <div className="img-hover-zoom-1 img-hover-zoom--blur-1">
                    <img src="//bizweb.dktcdn.net/100/364/402/themes/857456/assets/banner.jpg?1650271997394" data-src="//bizweb.dktcdn.net/100/364/402/themes/857456/assets/banner.jpg?1650271997394" alt="Banner quảng cáo" data-was-processed="true" />
                </div>
            </div>
            <div className="section_policy">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 giaohang">
                            <i className="fa-solid fa-truck-fast"></i>
                            <div className="text">
                                <b>Free Delivery</b>
                                <p>Free shipping on all order</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 giaohang">
                            <i className="fa-brands fa-creative-commons-sampling"></i>

                            <div className="text">
                                <b>Online Support 24/7</b>
                                <p>Online support 24 hours a day</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 giaohang">
                            <i className="fa-solid fa-box-open"></i>
                            <div className="text">
                                <b>Money Return</b>
                                <p>Back guarantee under 7 days</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 col-12 giaohang">
                            <i className="fa-solid fa-clipboard-list"></i>
                            <div className="text">
                                <b>Member Discount</b>
                                <p>On every order over 500.000đ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;