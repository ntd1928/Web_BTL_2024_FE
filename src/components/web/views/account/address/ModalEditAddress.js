import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SelectAddress from './SelectAddress';
import _ from 'lodash';


const formValid = ({ formErrors, ...rest }) => {
    let valid = true;
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val !== '' && (valid = false);
    });
    // validate the form was filled out
    Object.values(rest).forEach(val => {
        val === '' && (valid = false);
    });
    return valid;
};
const phoneRegex = RegExp(
    /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/
)
const ModalEditAddress = (props)=>{

    const [arrInput,setArrInput]=useState({
        id:'',fullName:'',phoneNumber:'',ward:'',district:'',city:'',shippingAdr:'',userId:'',
        formErrors:{
            fullName:'',phoneNumber:'',ward:'',district:'',city:'',shippingAdr:''
        }
    })
    const [empty,setEmpty]=useState(false);

    
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        let formErrors = arrInput.formErrors
        switch (name) {
            case "fullName":
                formErrors.fullName =
                    (value.length < 3 ) ? "Minimum 3 character required" : '';
                break;
            case "phoneNumber":
                formErrors.phoneNumber =
                    phoneRegex.test(value) ? "" : "Invalid email phone number";
                break;
            case "shippingAdr":
                formErrors.shippingAdr =
                    (value.length < 3 ) ? "Minimum 3 character required" : '';
                break;
            default:
                break;
        }
        setArrInput({ ...arrInput, [name]: value });
    };
    useEffect(()=>{
        let address = props.currentAddress;
        // console.log(address)
        if(address && !_.isEmpty(address)){
            arrInput.id=address.id;
            arrInput.fullName=address.fullName;
            arrInput.phoneNumber=address.phoneNumber;
            arrInput.ward=address.ward;
            arrInput.district=address.district;
            arrInput.city=address.city;
            arrInput.shippingAdr=address.shippingAdr;
            arrInput.userId=address.userId
            setArrInput({...arrInput});
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.currentAddress]);
    console.log(arrInput);

    const toggle=()=>{
        props.toggleFromParent()
    }
    const handleGetAddress = (address)=>{
        arrInput.ward = address.ward;
        arrInput.district = address.district;
        arrInput.city = address.city;
        setArrInput({...arrInput});
    }
    const handleEditAddress = async()=>{
        const {id,fullName,phoneNumber,ward,district,city,shippingAdr,userId}=arrInput;
        const data = {id:id,fullName:fullName,phoneNumber:phoneNumber,ward:ward,district:district,city:city,shippingAdr:shippingAdr,userId:userId}
        if(formValid(arrInput)){
            console.log(data);
            props.editAddress(data);
            setEmpty(false);
        }else{
            setEmpty(true)
            toast.error('Input empty!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    return(
        <Modal 
            isOpen={props.isOpen} 
            toggle={toggle} 
            className={props.className}
            size="lg"
            centered
            style={{width: "600px"}}
        >
            <ModalHeader toggle={toggle}>Add Address</ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        <div className="row">
                            <div class="col-12 mb-3">
                                <label class="form-label">Full Name</label>
                                <input 
                                    type='text'
                                     minLength={3} 
                                     placeholder="Full Name"
                                    className={"form-control " + ((arrInput.formErrors.fullName.length > 0 && arrInput.fullName !== '') || (empty === true) ? 'focusError' : '')}
                                    onChange={ handleOnChange}
                                    name="fullName"
                                    value={arrInput.fullName} 
                                    required
                                />
                                {arrInput.formErrors.fullName.length > 0 && arrInput.fullName !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {arrInput.formErrors.username}</p>
                                            : 
                                            ''
                                }
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">Phone number</label>
                                    <input required
                                    placeholder="Phone number"
                                        type="text" 
                                        className={"form-control " + ((arrInput.formErrors.phoneNumber.length > 0 && arrInput.phoneNumber !== '')||(empty === true) ? 'focusError' : '')}
                                        onChange={ handleOnChange}
                                        name="phoneNumber"
                                        maxLength={11} 
                                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                        value={arrInput.phoneNumber} 
                                    />
                                    {arrInput.formErrors.phoneNumber.length > 0 && arrInput.phoneNumber !== '' ?
                                        <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {arrInput.formErrors.phoneNumber}</p>
                                    : 
                                    ''
                                    }
                                    <div className="text-muted mt-1" style={{fontSize:"13px"}}>Keep 9-digit format with no spaces and dashes</div>
                                </div>
                            <ToastContainer />
                            <p>*<b>City:</b> {props.currentAddress.city}<br/> *<b>District:</b> {props.currentAddress.district}<br/> *<b>Ward:</b> {props.currentAddress.ward}</p>
                            <SelectAddress onSelect={handleGetAddress} />
                            <div class="col-12 mb-4">
                                <label class="form-label">Shipping Address</label>
                                <textarea 
                                    className={"form-control " + ((arrInput.formErrors.shippingAdr.length > 0 && arrInput.shippingAdr !== '')||(empty === true) ? 'focusError' : '')}
                                    rows="2" 
                                    name="shippingAdr" 
                                    required
                                    onChange={ handleOnChange}
                                    value={arrInput.shippingAdr}
                                    >
                                    {arrInput.shippingAdr}
                                </textarea>
                                {arrInput.formErrors.shippingAdr.length > 0 && arrInput.shippingAdr !== '' ?
                                    <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {arrInput.formErrors.shippingAdr}</p>
                                : 
                                ''
                                }
                            </div>                                                   
                        </div>            
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
                <Button style={{color:"#ffffff",backgroundColor:"rgb(231, 76, 60)",border:"none"}} onClick={()=>{handleEditAddress()}}>Add</Button>
            </ModalFooter>
        </Modal>
    )
   
}
export default ModalEditAddress;