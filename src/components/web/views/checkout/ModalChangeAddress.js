// import { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import _ from 'lodash';
import { useEffect, useState } from 'react';

const ModalChangeAddress = (props) => {
    const [index, setIndex] = useState(0);
    const [arrAddress, setArrAddress] = useState([]);
    const navigate = useNavigate(); // Khởi tạo navigate

    useEffect(() => {
        let address = props.getAddress;
        console.log(address)
        if (address && !_.isEmpty(address)) {
            setArrAddress(address);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.getAddress]);

    const handleAddAddress = () => {
        navigate('/account/address'); // Điều hướng đến router /account/address
    };

    const toggle = () => {
        props.toggleFromParent()
    }
    const handleSaveChange = () => {
        props.getIndex(parseInt(index));
    }
    return (
        <Modal
            isOpen={props.isOpen}
            toggle={toggle}
            className={props.className}
            size="lg"
            centered
            style={{ width: "600px" }}
        >
            <ModalHeader toggle={toggle}>Change Address <span style={{ color: "rgba(0, 0, 0, 0.7)" }}>({arrAddress.length})</span></ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        {arrAddress.length !== 0 && arrAddress.map((item, index) => (
                            <div class="form-check" key={item.id}>
                                <input class="form-check-input" type="radio" value={index} name="address" onChange={(e) => setIndex(e.target.value)} defaultChecked={index === props.id ? '1' : ''} />
                                <label class="form-check-label">
                                    <div>
                                        <span className="border-end pe-2 me-2"><b>{item.fullName}</b></span>
                                        <span>{item.phoneNumber}</span>
                                    </div>
                                    <div>{item.shippingAdr}</div>
                                    <div>{item.ward} , {item.district}, {item.city}</div>
                                </label>
                            </div>

                        ))

                        }
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button style={{ color: "#ffffff", backgroundColor: "rgb(24, 129, 77)", border: "none" }} onClick={handleAddAddress}>Add</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
                <Button style={{ color: "#ffffff", backgroundColor: "rgb(231, 76, 60)", border: "none" }} onClick={handleSaveChange}>Save Change</Button>
            </ModalFooter>
        </Modal>
    )

}
export default ModalChangeAddress;