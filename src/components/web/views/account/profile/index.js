import { useEffect, useState } from "react";
import { editUserService, getUserByEmail } from "../../../../services/userService";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const phoneRegex = RegExp(
    /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]‌​)\s*)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\s*(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+)\s*)?$/
)
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
const Profile = ()=>{
    const [showSave,setShowSave]=useState(false);
    const [getUser, setGetUser] = useState({
        username:'',phoneNumber:'',email:'',id:'',
        formErrors :{
            phoneNumber:''
        }
    });
    const [empty,setEmpty]=useState(false);

    const handleFormUpdate = ()=>{
        setShowSave(true);
    }
   
    const handleBack = ()=>{
        setShowSave(false);
    }
    useEffect(()=>{
        getUserFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    const getUserFromReact = async()=>{
        let email = localStorage.getItem('email')
        if (email) {
            let data= await getUserByEmail(email);
            if (data && data.data.errCode === 0) {
                setGetUser({...getUser,
                    username:data.data.user.username,
                    phoneNumber:data.data.user.phoneNumber,
                    email:data.data.user.email,
                    id:data.data.user.id,
                })
            }
        }
    }
    
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        let formErrors = getUser.formErrors
        switch (name) {
           
            case "phoneNumber":
                formErrors.phoneNumber =
                    phoneRegex.test(value) ? "" : "Invalid email phone number";
                break;
            default:
                break;
        }
        setGetUser({ ...getUser, [name]: value });
    };
    const handleSave = async()=>{
        let { phoneNumber,id } = getUser;
        let dataUser = {phoneNumber:phoneNumber,id:id }
        if (formValid(getUser)) {
            setEmpty(false);
            try {
                let list = await editUserService(dataUser);
                if(list.data && list.data.errCode !== 0 ){
                    toast.error(list.data.message, {
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
                if(list.data && list.data.errCode === 0 ){
                    toast.success('Update success!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setShowSave(false);
                }
            } catch (error) {
                toast.error(error, {
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
        } else{
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
    return (
        <div className="container">
            <h4>My Profile</h4>
            <div className="mt-5">
                <div className="title">Personal Information</div>
                <hr />
                <div className="row">
                    <div class="col-12 mb-3">
                        <label for="exampleFormControlInput1" class="form-label me-2">Username</label>
                        {showSave && 
                        <span className="text-muted" style={{fontSize:"13px"}}>
                                Not change
                        </span>
                        }
                        <input type="text" value={getUser.username} class="form-control" id="exampleFormControlInput1" disabled/>
                    </div>
                    
                    <div class="col-12 mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Phone number</label>
                        <input 
                            type="tel"
                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                            name="phoneNumber" 
                            maxLength={11}
                            required
                            onChange={handleOnChange} 
                            value={getUser.phoneNumber} 
                            disabled={showSave ? '':'1'}
                            // className="form-control"
                            className={"form-control " + (showSave ? ((getUser.formErrors.phoneNumber.length > 0 && getUser.phoneNumber !== '') ||(empty === true) ? 'focusError' : ''):'')}
                            />
                        {showSave && <div className="text-muted mt-1" style={{fontSize:"13px"}}>Keep 9-digit format with no spaces and dashes</div>}
                        
                        {getUser.formErrors.phoneNumber.length > 0 && getUser.phoneNumber !== '' ?
                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {getUser.formErrors.phoneNumber}</p>
                            : 
                            ''
                            }
                    </div>
                    <div class="col-12 mb-3">
                        <label class="form-label me-2">Email address</label>
                        {showSave && 
                        <span className="text-muted" style={{fontSize:"13px"}}>
                                Not change
                        </span>
                        }
                        <input type="email" value={getUser.email} class="form-control" disabled/>
                    </div>
                    <ToastContainer />
                    {showSave ? 
                    <div className="d-flex justify-content-end">
                        <button className="px-4 btn btn-secondary me-3" onClick={handleBack}>Back</button>
                        <button className="px-4 btn" style={{color:"#ffffff",backgroundColor:"rgb(231, 76, 60)"}} onClick={handleSave}>Save</button>
                    </div>
                    :
                    <div className="d-flex justify-content-end">
                        <button className="btn px-4" style={{color:"#ffffff",backgroundColor:"rgb(231, 76, 60)"}} onClick={handleFormUpdate}>Update</button>
                    </div>
                    }
                    
                </div>
            </div>
        </div>  
    )
}
export default Profile;