import {useEffect, useState} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { emitter } from "../../../../utils/emitter";
import _ from 'lodash';
import Swal from "sweetalert2";

const formValid = ({ ...rest }) => {
    let valid = true;
    Object.values(rest).forEach(val => {
        val === '' && (valid = false);
    });
    return valid;
}

const ModalEditCategory =(props)=> {
    
    const [arrInput,setArrInput]=useState({
        id:'',name:'', description:''
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
    //         description:'',
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
    //             description:'',
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
        let category = props.currentCategory;
        if(category && !_.isEmpty(category)){
            setArrInput(category);
        }
        
    },[props.currentCategory])

    
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


    const handleSaveCategory =()=>{
        const {id,name,description}=arrInput;
        const data={id:id,name:name,description:description}
        if(formValid(arrInput)){
            props.editCategory(data);
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
            <ModalHeader toggle={toggle}>Edit Category</ModalHeader>
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
                                <label className="form-label" htmlFor="description">Description<b className="text-danger">*</b>:</label>
                                <input type="text" required name="description" id="description" value={arrInput.description} className="form-control" onChange={handleChange} />
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
    )
}

export default ModalEditCategory;