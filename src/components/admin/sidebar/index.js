import { useState } from "react";
// import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from "react-router-dom";
// import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

const SideBar = (props) => {

    const [openProduct, setOpenProduct] = useState(false);
    const [openNews, setOpenNews] = useState(false);

    const handleOpenProduct = () => {
        setOpenProduct(!openProduct);
        setOpenNews(false)
    }
    const handleOpenNews = () => {
        setOpenNews(!openNews);
        setOpenProduct(false)
    }
    return (
        <nav id="sidebar-content" className={props.isHide === true ? "active" : ""}>
            <div className="px-4 py-2">
                <h2 className="pb-3">Admin</h2>
                <ul className="list-unstyled components mb-5">
                    <li>
                        <p className="title-nav text-black-50 mt-4 text-uppercase">Dashboard</p>
                        <NavLink className={(navData) => navData.isActive ? "active" : ""} to="" end ><i class="fa-solid fa-chart-line"></i> Dashboard</NavLink>
                    </li>
                    <li>
                        <p className="title-nav text-black-50 mt-4 text-uppercase">Pages</p>
                        <NavLink className={(navData) => navData.isActive ? "active" : ""} to="list-type-product" ><i class="fa-solid fa-circle-nodes"></i>Type Product</NavLink>
                    </li>
                    <li>
                        <span className='dropdown-toggle'
                            onClick={handleOpenProduct}
                            data-toggle="collapse"
                            aria-expanded={openProduct}
                        >
                            <i className="fa-solid fa-list"></i> Product
                        </span>

                        <Collapse in={openProduct}>
                            <ul id="product">
                                <li>
                                    <NavLink className={(navData) => navData.isActive ? "active" : ""} to="list-product" > List</NavLink>
                                </li>
                                <li>
                                    <NavLink className={(navData) => navData.isActive ? "active" : ""} to="add-product" > Add</NavLink>
                                </li>
                                <li>
                                    <NavLink className={(navData) => navData.isActive ? "active" : ""} to="color" > Color</NavLink>
                                </li>

                            </ul>
                        </Collapse>
                    </li>
                    <li>
                        <NavLink className={(navData) => navData.isActive ? "active" : ""} to="users" ><i class="fa-regular fa-user"></i> User</NavLink>
                    </li>
                    <li>
                        <NavLink className={(navData) => navData.isActive ? "active" : ""} to="orders" ><i class="fa-solid fa-box-open"></i> Order</NavLink>
                    </li>
                    <li>
                        <p className="title-nav text-black-50 mt-4 text-uppercase">Interfaces</p>
                        <span className='dropdown-toggle'
                            onClick={handleOpenNews}
                            data-toggle="collapse"
                            aria-expanded={openNews}

                        >
                            <i className="fa-regular fa-newspaper"></i> Blog
                        </span>
                        <Collapse in={openNews}>
                            <ul id="type-product">
                                <li>
                                    <NavLink className={(navData) => navData.isActive ? "active" : ""} to="list-blog" > List</NavLink>
                                </li>
                                <li>
                                    <NavLink className={(navData) => navData.isActive ? "active" : ""} to="add-blog" > Add</NavLink>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                    <li>
                        <NavLink className={(navData) => navData.isActive ? "active" : ""} to="list-comment" ><i class="fa-regular fa-comment"></i> Comment</NavLink>
                    </li>
                    <li>
                        <NavLink className={(navData) => navData.isActive ? "active" : ""} to="list-feedback" ><i class="fa-regular fa-envelope"></i> Feedback</NavLink>
                    </li>

                </ul>
            </div>
        </nav>

    )
}

export default SideBar;