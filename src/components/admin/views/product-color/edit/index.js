import {useEffect, useState} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import Swal from "sweetalert2";

const formValid = ({ ...rest }) => {
    let valid = true;
    Object.values(rest).forEach(val => {
        val === '' && (valid = false);
    });
    return valid;
}

const ModalEditColor =(props)=> {
    
    const [arrInput,setArrInput]=useState({
        id:'',name:'', code:''
    })
   
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         id: '',
    //         name: '',
    //         image: '',
    //         price: '',
    //         priceDiscount: '',
    //         percent: '',
    //         code:'',
    //         context:'',
    //         typeId:'',
    //         errMessage:'',
    //     }
    //     this.listenToEmitter();
    // }
    // fire event: child -> parent (props)
    // parent -> child (ref)
    // => both: emitter(event)

    // listenToEmitter(){
    //     // emitter.on('EVENT_CLEAR_MODAL_DATA',data =>{
    //     //     console.log('listen emitter from parent: ',data)
    //     // })
    //     emitter.on('EVENT_CLEAR_MODAL_DATA',()=>{
    //         //reset state
    //         this.setState ({
    //             id: '',
    //             name: '',
    //             image: '',
    //             price: '',
    //             priceDiscount: '',
    //             percent: '',
    //             code:'',
    //             context:'',
    //             typeId:'',
    //         })
    //     })
    // }

    const handleChange = (e)=>{
        const {name,value}=e.target;
        setArrInput({...arrInput,[name]:value})
        console.log(arrInput)
    }

    useEffect (()=>{
        let type_product = props.currentColor;
        if(type_product && !_.isEmpty(type_product)){
            setArrInput(type_product);
        }
        
    },[props.currentColor])

    
    // componentDidMount(){
    //     let product = this.props.currentProduct;
    //     // let  {currentUser} = this.props

    //     if(product && !_.isEmpty(product)){
    //         this.setState({
    //             id: product.id,
    //             name: product.name,
    //             image: product.image,
    //             firstName: product.firstName,
    //             lastName:product.lastName,
    //             address: product.address,
    //             phoneNumber: product.phoneNumber
    //         })
    //     }
    // }

    const toggle=()=>{
        props.toggleFromParent()
    }
   
    
    // handleOnChangeInput = (event,id) => {
    //     //good code
    //     let copyState = { ...this.state };
    //     copyState[id] = event.target.value;
    //     this.setState({
    //         ...copyState
    //     })
    // }


    const handleSaveColor =()=>{
        const {id,name,code}=arrInput;
        const data={id:id,name:name,code:code}
        if(formValid(arrInput)){
            props.editColor(data);
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please check your input!',
              })
        }
    }
    return(
        <Modal 
            isOpen={props.isOpen} 
            toggle={toggle} 
            className={props.className}
            size="lg"
            centered
        >
            <ModalHeader toggle={toggle}>Edit a Color</ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label" htmlFor="name">Name<b className="text-danger">*</b>:</label>
                                <input type="text" 
                                    required name="name" id="name" value={arrInput.name} className="form-control" onChange={handleChange} />
                            </div>
                            
                            <div className="col-md-8">
                                {/* <label className="form-label" htmlFor="code">Code<b className="text-danger">*</b>:</label>
                                <input type="text" required name="code" id="code" value={arrInput.code} className="form-control" onChange={handleChange} /> */}
                                <label className="form-label">Code<b className="text-danger">*</b>:</label>
                                <div className="d-flex align-items-center">
                                    <input 
                                        type="color" 
                                        required 
                                        name="code" 
                                        value={arrInput.code} 
                                        className="form-control form-control-color" 
                                        onChange={(e)=>handleChange(e)} 
                                    
                                        />
                                    <p className="mx-2" style={ { color: `${arrInput.code}`,margin:'0px' } }>{arrInput.code}</p>
                            </div>
                            </div>

                            
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button style={{backgroundColor:"#5046e5"}} onClick={()=>{handleSaveColor()}}>Save</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalEditColor;