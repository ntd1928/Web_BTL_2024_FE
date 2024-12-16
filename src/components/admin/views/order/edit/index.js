import { useState,useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import Swal from "sweetalert2";
import moment from "moment";

const ModalEditOrder = (props)=>{
    const [arrInput,setArrInput]=useState({
        id:'',status:'', deliveryDate:''
    })
    const handleOnChange = (e)=>{
        const {name,value}=e.target;
        setArrInput({...arrInput,[name]:value})
        
    }
    console.log(arrInput)

    useEffect (()=>{
        let order = props.currentOrder;
        
        if(order && !_.isEmpty(order)){
            setArrInput(order);
        }
        
    },[props.currentOrder]);

    const toggle=()=>{
        props.toggleFromParent()
    }
    const formValid = ({ ...rest }) => {
        let valid = true;
        Object.values(rest).forEach(val => {
            val === '' && (valid = false);
        });
        return valid;
    }
    
    const handleSaveCategory =()=>{
        const {id,status,deliveryDate}=arrInput;
        const data={id:id,status:status,deliveryDate:deliveryDate}
        if(formValid(arrInput)){
            props.editOrder(data);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please check your input!',
              })
        }
    }
    return(
        <>
            <Modal 
            isOpen={props.isOpen} 
            toggle={toggle} 
            className={props.className}
            size="lg"
            centered
        >
            <ModalHeader toggle={toggle}>Edit Status Order</ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        <div className="row g-3">
                            <div className="col-md-8">
                            <label className="form-label">
                                Status:
                            </label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="status" value="processing" onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                            });
                                        }} checked={arrInput.status==='processing' ? '1':''}  disabled={(props.currentOrder.status==='shipping' || props.currentOrder.status==='delivered' || props.currentOrder.status==='cancel') ? '1' : ''}/>
                                    <label class="form-check-label">
                                    Processing
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="status" value="shipping" onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                            });
                                        }} checked={arrInput.status==='shipping' ? '1':''} disabled={(props.currentOrder.status==='delivered' || props.currentOrder.status==='cancel' ) ? '1' : ''}/>
                                    <label class="form-check-label">
                                    Shipping
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="status" value="delivered" onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                            });
                                        }} checked={arrInput.status==='delivered' ? '1':''} disabled={props.currentOrder.status==='cancel' ? '1' : ''}/>
                                    <label class="form-check-label">
                                    Delivered
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="status" value="cancel" onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.value,
                                            },
                                            });
                                        }} checked={arrInput.status==='cancel' ? '1':''} disabled={props.currentOrder.status==='delivered' ? '1' : ''}/>
                                    <label class="form-check-label">
                                    Cancel
                                    </label>
                                </div>
                                
                            </div>
                            
                            <div className="col-md-8">
                                <label className="form-label" htmlFor="deliveryDate">Delivery Date<b className="text-danger">*</b>:</label>
                                <input min={moment(new Date()).format("YYYY-MM-DD")} type="date" value={arrInput.deliveryDate ? moment(arrInput.deliveryDate).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD")} name="deliveryDate" className="form-control" onChange={handleOnChange} disabled={(props.currentOrder.status==='delivered' || props.currentOrder.status==='cancel') ? '1' : ''}/>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button style={{backgroundColor:"#5046e5"}} onClick={()=>{handleSaveCategory()}}>Save changes</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
        </>
    )
}
export default ModalEditOrder;