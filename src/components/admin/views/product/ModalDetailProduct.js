import {useEffect, useState} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getDetailProductService } from "../../../services/productService";
import Color from "./Color";
const ModalDetailProduct = (props)=>{
    const id= props.product.id;
    console.log(id);
    const [detailproduct,setDetailProduct]=useState([]);

    useEffect (()=>{
        getDetailProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id]);
    
    const getDetailProduct = async()=>{
        const list = await getDetailProductService(id);
        if(list && list.data.errCode === 0){
            setDetailProduct(list.data.detailproducts);
        }
        console.log(detailproduct);
    }
    const toggle=()=>{
        props.toggleFromParent()
    }
    return(
        <Modal 
            isOpen={props.isOpen} 
            toggle={toggle} 
            className={props.className}
            size="lg"
            centered
        >
            <ModalHeader toggle={toggle}><span className="text-muted">Detail Product of</span> {props.product.name}({props.product.id})</ModalHeader>
            <ModalBody>
                <div className="container">
                    <div className="">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    <th className='text-center align-middle form-title'>Color</th>
                                    <th className='text-center align-middle form-title'>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                            {detailproduct && detailproduct.map((item,index)=>{
                                    return(
                                        <tr key={item.id}>
                                            <td className='text-center align-middle'>{index+1}</td>
                                            <td className='text-center align-middle'>
                                                <Color colorId={item.colorId} />
                                            </td>
                                            <td className='text-center align-middle'>
                                                {item.qtyProduct}
                                            </td>
                                        </tr>
                                    )
                                    })}
                            </tbody>
                        </table>                       
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Hủy</Button>
            </ModalFooter>
        </Modal>
    )

}
export default ModalDetailProduct;