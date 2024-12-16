import { useEffect, useState } from "react";
import ModalAddress from "./ModalAddress";
import ModalEditAddress from "./ModalEditAddress";
import { createAddress, getAllAddressByUserId, updateAddress } from "../../../../services/addressService";
import Swal from "sweetalert2";
import { getUserByEmail } from "../../../../services/userService";
const Address = ()=>{

    const [user,setUser] = useState({});
    const [listAddress,setListAddress]=useState([]);
    const [isOpenModalAddress,setIsOpenModalAddress]=useState(false);
    const [isOpenModalEditAddress,setIsOpenModalEditAddress] = useState(false);
    const [addressEdit,setAddressEdit]=useState({})


    const handleFormAdd = ()=>{
        if(listAddress.length !== 5){
            setIsOpenModalAddress(true);
        }else{
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'You had 5 addresses',
                showConfirmButton: false,
                timer: 1500
              })
        }
        
    }
    const toggleAddressModal = ()=>{
        setIsOpenModalAddress(!isOpenModalAddress);
    }
    
    const toggleAddressEditModal = ()=>{
        setIsOpenModalEditAddress(!isOpenModalEditAddress);

    }

    useEffect(()=>{
        getAddressFromReact();
    },[]);
    
    const getAddressFromReact = async()=>{
        let email = localStorage.getItem('email')
        if (email) {
            let data= await getUserByEmail(email);
            if (data && data.data.errCode === 0) {
                setUser(data.data.user);
                let list = await getAllAddressByUserId(data.data.user.id);
                if(list && list.data.errCode === 0){
                    setListAddress(list.data.address);
                }
            }
        }
    }
   
    const createNewAddress = async(data) => {
        try {
            let response = await createAddress(data,user.id);
            if(response && response.data.errCode !== 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.errMessage,
                  })
            }else{
                await getAddressFromReact();
                setIsOpenModalAddress(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
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
    const handleFormUpdate = async(category)=>{
        setIsOpenModalEditAddress(true);
        setAddressEdit(category)
    }

    const doEditAddress = async(data) => {
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    let res = await updateAddress(data);
                    if(res && res.data.errCode===0){
                        setIsOpenModalEditAddress(false)
                        await getAddressFromReact()
                        Swal.fire('Saved!', '', 'success')
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.errMessage,
                          })
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error,
                      })
                }                
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
          })
        
    }


    return (
        <div className="container">
            <h4>My Address Book</h4>
                <div className="mt-5">
                    <ModalAddress 
                        isOpen = {isOpenModalAddress}
                        toggleFromParent = {toggleAddressModal}
                        createNewAddress = {createNewAddress}
                        listAddress = {listAddress}

                    />
                    {isOpenModalEditAddress&&
                        <ModalEditAddress
                            isOpen = {isOpenModalEditAddress}
                            editAddress = {doEditAddress}
                            toggleFromParent = {toggleAddressEditModal}
                            currentAddress = {addressEdit}
                        />
                        }
                    
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="">
                            <span className="title">List Address</span>
                        </div>
                        <div>
                            <button className="btn btn-success px-4" onClick={handleFormAdd}>Add</button><br/>
                            <span className="text-muted mt-1" style={{fontSize:"13px"}}>Up to 5 addresses</span>
                        </div>
                    </div>
                    <hr />
                    {listAddress.length !== 0 ? listAddress.map(item=>(
                        <div key={item.id}>
                            <div>
                            <span className="border-end pe-2 me-2"><b>{item.fullName}</b></span>
                            <span>{item.phoneNumber}</span>
                            </div>
                            <div>{item.shippingAdr}</div>
                            <div>{item.ward} , {item.district}, {item.city}</div>
                            <div className="d-flex justify-content-end">
                                <button className="btn px-4" style={{color:"#ffffff",backgroundColor:"rgb(231, 76, 60)"}} onClick={()=>handleFormUpdate(item)}>Update</button>
                            </div>
                        </div>
                    ))
                    :
                    <p className="text-center">You haven't created an address yet.</p>
                    }
                    
            </div>
        </div>  
    )
}
export default Address;