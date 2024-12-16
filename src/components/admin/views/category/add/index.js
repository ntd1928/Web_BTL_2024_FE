import { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from "sweetalert2";

const formValid = ({ ...rest }) => {
    let valid = true;
    Object.values(rest).forEach(val => {
        val === '' && (valid = false);
    });
    return valid;
}

const ModalCategory = (props) => {
    const [arrInput, setArrInput] = useState({
        name: '', description: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setArrInput({ ...arrInput, [name]: value })
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


    const toggle = () => {
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

    const handleAddNewCategory = async () => {
        const { name, description } = arrInput;
        const data = { name: name, description: description }
        console.log('modal reactjs:', data)
        console.log(formValid(arrInput));
        if (formValid(arrInput)) {
            try {
                await props.createNewCategory(data);
                console.log('Category created successfully');
            } catch (error) {
                console.error('Error in creating category:', error);
            }
            setArrInput({
                name: '', description: ''
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please check your input!',
            })
        }
    }

    return (
        <Modal
            isOpen={props.isOpen}
            toggle={() => { toggle() }}
            className={props.className}
            size="lg"
            centered
        >
            <ModalHeader toggle={() => { toggle() }}>Add a category</ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label">Name<b className="text-danger">*</b>:</label>
                                <input type="text"
                                    required name="name" value={arrInput.name} className="form-control" onChange={(e) => handleChange(e)} />
                            </div>

                            <div className="col-md-8">
                                <label className="form-label">Description<b className="text-danger">*</b>:</label>
                                <input type="text" required name="description" value={arrInput.description} className="form-control" onChange={(e) => handleChange(e)} />
                            </div>

                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button style={{ backgroundColor: "#5046e5" }} onClick={() => { handleAddNewCategory() }}>Create</Button>
                <Button color="secondary" onClick={() => { toggle() }}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )

}
export default ModalCategory;  