import { useState,useEffect } from "react";
import { getAllAddress } from "../../../../services/addressService";
const AddressOrder = (props)=>{

    const [address,setAddress]=useState({});

    const addId=props.idAdd;
    
    useEffect(()=>{
        const getAddressFromReact = async()=>{
        let list = await getAllAddress(addId);
        console.log(list);
        if(list && list.data.errCode === 0){
            setAddress(list.data.address);
        }

    }
        getAddressFromReact()
    },[addId]);
    return(
        <>
            <p className="text-muted m-0">Address</p>
            <div>
                <b>{address.fullName}</b><br />
                <span className="mb-1">{address.shippingAdr}, {address.ward} , {address.district}, {address.city}</span><br />
                <p>{address.phoneNumber}</p>
            </div>
        </>
    )
}
export default AddressOrder;