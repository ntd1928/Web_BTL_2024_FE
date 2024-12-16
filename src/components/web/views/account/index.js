import { Route, Routes } from "react-router-dom";
import SideBar from "./sidebar";
import Profile from "./profile";
import Address from "./address";
import Order from "./order";
const Account = ()=>{
    return(
        <>
        <hr/>
        <div className="container account">
        <h3 className="text-start">My Account</h3>
            <div className="row">
                <div className="col-md-2 p-0">
                    <div>
                        <SideBar />
                    </div>
                </div>
                <div className="col-md-9 pt-4 px-0">
                    <div className="" style={{padding: "20px",boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px"}}>
                        <Routes>
                            <Route path="/" element={<Profile />} />
                            <Route path="address" element={<Address/>} />
                            <Route path="order" element={<Order />} />
                        </Routes>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}
export default Account;