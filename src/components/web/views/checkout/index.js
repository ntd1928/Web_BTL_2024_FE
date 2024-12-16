
import { useState, useEffect } from "react";
import { getUserByEmail } from "../../../services/userService";
import { getAllAddressByUserId } from "../../../services/addressService";
import ModalChangeAddress from "./ModalChangeAddress";
import Swal from "sweetalert2";
import { addOrder } from "../../../services/orderService";
import { deleteAllCart } from "../../../services/cartService";
import { Link } from "react-router-dom";
// import ModalChangeAddress from "./ModalChangeAddress";
const CheckoutDetail = () => {
    const [index, setIndex] = useState(0);
    const [isOpenModalAddress, setIsOpenModalAddress] = useState(false);
    const [listAddress, setListAddress] = useState([]);
    const [address, setAddress] = useState({});
    const [order, setOrder] = useState({});
    // const [deliveryDate,setDeliveryDate]=useState('');
    const [message, setMessage] = useState('');

    const [user, setUser] = useState('');

    const handleChangeAddress = () => {
        setIsOpenModalAddress(true);
    }
    const toggleAddressModal = () => {
        setIsOpenModalAddress(!isOpenModalAddress);
    }
    useEffect(() => {
        getUserFromReact();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const getUserFromReact = async () => {
        let email = localStorage.getItem('email');
        if (email) {
            let data = await getUserByEmail(email);
            if (data && data.data.errCode === 0) {
                setUser(data.data.user);
                let address = await getAllAddressByUserId(data.data.user.id);

                if (address && address.data.errCode === 0) {
                    setListAddress(address.data.address);
                    if (address.data.address.length !== 0) {
                        setAddress(address.data.address[index]);
                    } else {
                        setAddress({});
                    }
                }
            }
            let order = await localStorage.getItem('data');
            setOrder(JSON.parse(order));

        }
    }

    const handleGetIndex = async (i) => {
        setIndex(i);
        setIsOpenModalAddress(false)
        await getUserFromReact();
        Swal.fire('Saved!', '', 'success')

    }

    const handleAddOrder = async (tt, idU, idAdr, list) => {
        let orderId = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
        let pp = list.filter((ele, ind) => ind === list.findIndex(elem => elem.productId === ele.productId && elem.color === ele.color && elem.price === ele.price))
        const data = {
            number: orderId,
            grandTotal: tt,
            userId: idU,
            addressId: idAdr ? idAdr : '',
            list: pp
        }
        if (data.grandTotal !== 0) {
            if (data.addressId !== '') {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            let order = await addOrder(data);
                            if (order && order.data.errCode === 0) {
                                let res = await deleteAllCart(user.id);
                                if (res && res.data.errCode === 0) {
                                    Swal.fire(
                                        'You order success!',
                                        order.data.errMessage,
                                        'success'
                                    )
                                    window.location.href = "/product";

                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: res.data.errMessage,
                                    })
                                }

                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Oops...',
                                    text: order.data.errMessage,
                                })
                            }
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: error,
                            })
                        }
                    }
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please check your address!',
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You must be add to cart!',
            })
        }

    }
    return (
        <>
            <hr />
            <div className="container">
                <Link to="/cart"><i class="fa-solid fa-arrow-left"></i> Back</Link>
                <h3 className="text-center">Checkout Details</h3>

                <div className="row">
                    <ModalChangeAddress
                        isOpen={isOpenModalAddress}
                        toggleFromParent={toggleAddressModal}
                        getAddress={listAddress}
                        id={index}
                        getIndex={handleGetIndex}
                    // createNewAddress = {createNewAddress}
                    />
                    <div className="text-end">
                        {/* <Button style={{backgroundColor:"#5046e5"}} className="me-3 px-4" onClick={handleAddNewProduct}>Create</Button> */}
                    </div>
                    <div className="col-md-8">
                        <div className="cart mt-4">
                            <div className="d-flex justify-content-between">
                                <h5 className="form-title">Your address</h5>
                                <div>
                                    <button className="btn btn-success" onClick={handleChangeAddress}>Change Address</button>
                                </div>
                            </div>
                            <hr />

                            {Object.keys(address).length !== 0 ? (
                                <div className="row cart-content" >
                                    <div className="col-12 mb-4">
                                        <b className="me-2">Full Name: </b>
                                        <span>{address.fullName}</span>
                                    </div>

                                    <div className="col-12 mb-4">
                                        <b className="me-2">Phone Number: </b>
                                        <span>{address.phoneNumber}</span>
                                    </div>
                                    <div className="col-12 mb-4">
                                        <b className="me-2">Address: </b>
                                        <span>{address.ward}, {address.district}, {address.city}</span>
                                    </div>
                                    <div class="col-12 mb-4">
                                        <b className="me-2">Shipping Address: </b>
                                        <span>{address.shippingAdr}</span>
                                    </div>
                                </div>
                            ) :
                                <p>No Address</p>
                            }


                        </div>
                        <div className="cart mt-4">
                            <h5 className="form-title">Your Message</h5>
                            <hr />
                            <div className="row cart-content">
                                <div class="col-12 mb-4">
                                    <label class="form-label">Message:</label>
                                    <textarea class="form-control" rows="3" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="cart mt-4">
                                    <h5 className="form-title">Information detail and pricing</h5>
                                    <hr />
                                    <div className="row cart-content">
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <b>Amount:</b>
                                            </div>
                                            <div className="col-6">
                                                {order.quantity}
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <b>Subtotal Price:</b>
                                            </div>
                                            <div className="col-6">
                                                {order.grandTotal ? new Intl.NumberFormat().format(order.grandTotal) : '0'}đ
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <b>Shipping Cost:</b>
                                            </div>
                                            <div className="col-6">
                                                0đ (Free)
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <b>Total:</b>
                                            </div>
                                            <div className="col-6">
                                                {new Intl.NumberFormat().format(order.grandTotal)}đ
                                            </div>
                                        </div>

                                        <div className="text-end mt-2">
                                            <button className='btn btn-success' onClick={() => handleAddOrder(order.grandTotal, user.id, address.id, order.list)}>Shop Now</button>
                                        </div>
                                    </div>

                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CheckoutDetail;