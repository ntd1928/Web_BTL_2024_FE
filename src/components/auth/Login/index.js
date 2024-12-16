import { useState } from 'react';
import { authenticate, handleLoginApi } from '../../services/userService';
// import Alert from 'react-bootstrap/Alert';
import '../../styles/Login.css';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

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

const Login = () => {
    const [inputValues, setInputValues] = useState({
        email: '', password: '',
        formErrors: {
            email: '', password: ''
        }
    })
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [empty, setEmpty] = useState(false)
    // const [isLoggedIn,setIsLoggedIn]=useState(false);
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        let formErrors = inputValues.formErrors
        switch (name) {
            case "email":
                formErrors.email = emailRegex.test(value)
                    ? ""
                    : "Invalid email address";
                break;
            case "password":
                formErrors.password =
                    value.length < 8 ? "Minimum 8 characters required" : "";
                break;
            default:
                break;
        }
        setInputValues({ ...inputValues, [name]: value });
    };


    const handleShowHidePassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    const handleSubmit = async () => {
        let { email, password } = inputValues;
        let dataUser = { email: email, password: password }
        if (formValid(inputValues)) {
            setEmpty(false);
            try {
                let data = await handleLoginApi(dataUser);
                if (data.data && data.data.errCode !== 0) {
                    toast.error(data.data.message, {
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
                if (data.data && data.data.errCode === 0) {
                    // setIsLoggedIn(true);
                    toast.success('Login success!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    await authenticate(data.data.token, data.data.user.email);
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
                // if(error.response){
                //     if(error.response.data){
                //         setErrMessage(error.response.data.message);
                //     }
                // }   
            }
        } else {
            setEmpty(true);
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
        <div className="background min-vh-100 d-flex flex-row align-items-center">
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className="card-group">
                            <div className="p-4 card">
                                <div className="card-body">
                                    <h1>Login</h1>
                                    <p class="text-muted">Sign In to your account</p>
                                    <div className='pt-3'>
                                        <div className="mb-3">
                                            <label className='form-label'>Email: </label>
                                            <input placeholder="Email" type="email" className={"form-control " + ((inputValues.formErrors.email.length > 0 && inputValues.email !== '') || (empty === true) ? 'focusError' : '')} name='email' value={inputValues.email} onChange={handleOnChange} required />
                                            {inputValues.formErrors.email.length > 0 && inputValues.email !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.email}</p>
                                                :
                                                ''
                                            }
                                        </div>

                                        <div className="mb-3">
                                            <label className='form-label'>Password: </label>
                                            <div className="custom-input-password">
                                                <input placeholder="Password" minLength={8} type={isShowPassword ? 'text' : 'password'} className={"form-control " + ((inputValues.formErrors.password.length > 0 && inputValues.password !== '') || (empty === true) ? 'focusError' : '')} name='password' value={inputValues.password} onChange={handleOnChange} />
                                                <span onClick={handleShowHidePassword}>
                                                    <i class={isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                                                </span>
                                            </div>
                                            {inputValues.formErrors.password.length > 0 && inputValues.password !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.password}</p>
                                                :
                                                ''
                                            }
                                        </div>

                                        {/* {errMessage !=='' &&
                                        <Alert key="danger" variant="danger">
                                            {errMessage}
                                        </Alert>
                                        } */}
                                        <ToastContainer />

                                        <div className="d-flex justify-content-between align-items-center my-3">
                                            <div className="">
                                                <button type="submit" className="btn col-12 px-4" style={{ backgroundColor: "#e74c3c", color: "#ffffff" }} onClick={handleSubmit}>Login</button>
                                            </div>
                                            <div className="">
                                                <span className="login-button-hover text-decoration-underline">Forgotten password?</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='card text-white bg-primary py-5'>
                                <div className="card-body text-center">
                                    <div>
                                        <h2>Welcome back</h2>
                                        <p>The faster you fill up, the faster you get a ticket</p>
                                        <button onClick={event => window.location.href = '/register'} className="btn btn-primary mt-3 active" aria-current="page" type="button" tabIndex="-1">Register Now!</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;
