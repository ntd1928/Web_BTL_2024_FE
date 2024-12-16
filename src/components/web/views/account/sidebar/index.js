// import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from "react-router-dom";
// import Button from 'react-bootstrap/Button';

const SideBar =()=>{

    return (
            <nav className="account-sidebar">
                <div className="py-3">
                    <ul className="list-unstyled mb-5">
                        <li className="my-4">
                            <NavLink className={(navData) => navData.isActive ? "active" : "" } to="" end ><i class="me-2 fa-regular fa-circle-user"></i> My Profile</NavLink>
                        </li>
                        <li className="my-4">
                            <NavLink className={(navData) => navData.isActive ? "active" : "" } to="address" ><i class="me-2 fa-regular fa-address-book"></i> My Address</NavLink>
                        </li>
                        <li className="my-4">
                            <NavLink className={(navData) => navData.isActive ? "active" : "" } to="order" ><i class="me-2 fa-solid fa-store"></i> My Orders</NavLink>
                        </li>
                       
                    </ul>
                </div>
            </nav>

    )
}

export default SideBar;