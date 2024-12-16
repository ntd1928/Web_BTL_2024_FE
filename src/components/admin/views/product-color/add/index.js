import { useState} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from "sweetalert2";

const formValid = ({ ...rest }) => {
    let valid = true;
    Object.values(rest).forEach(val => {
        val === '' && (valid = false);
    });
    return valid;
}

const ModalColor=(props)=> {

    const [arrInput,setArrInput]=useState({
        name:'',code:'#000000'
    })

    const handleChange=(e)=>{
        const {name,value}=e.target
        setArrInput({...arrInput,[name]:value})
    }

    // constructor(props){
    //     super(props);
    //     this.state = {
    //         name: '',
    //         image: '',
    //         price: '',
    //         priceDiscount: '',
    //         percent: '',
    //         description:'',
    //         context:'',
    //         typeId:'',
    //         listColor: [
    //             {color:"#00000"}
    //         ]
    //     }
    //     this.listenToEmitter();
    // }

    // listenToEmitter(){
    //     emitter.on('EVENT_CLEAR_MODAL_DATA',()=>{
    //         //reset state
    //         this.setState ({
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
    
   
    const toggle=()=>{
        props.toggleFromParent()
    }
 
    // const handleOnChangeInput = (event,id) => {
    //     let copyState = { ...this.state };
    //     copyState[id] = event.target.value;
    //     this.setState({
    //         ...copyState,
    //     })
    //     console.log(this.state)
    // }

    // checkValidateInput=()=>{
    //     let isValue = true;
    //     let arrInput = ['name','price','priceDiscount','percent','description','context','typeId'];
    //     for(let i = 0; i< arrInput.length;i++){
    //         if(!this.state[arrInput[i]]){
    //             isValue = false;
    //             alert('Missing parameter: '+ arrInput[i]);
    //             break;
    //         }
    //     }
    //     return isValue;

    // }

    const handleAddNewColor = async()=>{
        const {name,code}=arrInput;
        const data = {name:name,code:code}
        console.log('modal reactjs:',data)
        if(formValid(arrInput)){
            props.createNewColor(data);
            setArrInput({
                name:'',code:'#000000'
            });
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
            toggle={()=>{toggle()}} 
            className={props.className}
            size="lg"
            centered
        >
            <ModalHeader toggle={()=>{toggle()}}>Create a new color</ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label">Name<b className="text-danger">*</b>:</label>
                                <input type="text" 
                                        required 
                                        name="name" 
                                        value={arrInput.name} 
                                        className="form-control" 
                                        onChange={(e)=>handleChange(e)} 
                                />
                            </div>
                            
                            <div className="col-md-8">
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
                <Button style={{backgroundColor:"#5046e5"}} onClick={()=>{handleAddNewColor()}}>Add</Button>
                <Button color="secondary" onClick={()=>{toggle()}}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
    
}
export default ModalColor;