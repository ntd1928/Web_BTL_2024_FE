import { useState } from "react";
// import Alert from 'react-bootstrap/Alert';

import { handleRegisterApi } from "../../services/userService";
import '../../styles/Login.css';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const phoneRegex = RegExp(
    /^(?:\+84|0)(3[2-9]|5[2-9]|7[0-9]|8[1-9]|9[0-9])\d{7}$/
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

const Register = () => {

    const [inputValues, setInputValues] = useState({
        username: '', email: '', password: '', confirmPassword: '', phoneNumber: '',
        formErrors: {
            username: '', email: '', password: '', confirmPassword: '', phoneNumber: '',
        }
    })
    const [empty, setEmpty] = useState(false);

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        let formErrors = inputValues.formErrors
        switch (name) {
            case "username":
                formErrors.username =
                    (value.length < 3) ? "Minimum 3 character required" : '';
                break;
            case "email":
                formErrors.email =
                    emailRegex.test(value) ? "" : "Invalid email address";
                break;
            case "password":
                formErrors.password =
                    (value.length < 8) ? "Minimum 8 character required" : "";
                break;
            case "confirmPassword":
                formErrors.confirmPassword =
                    (value.length < 8) ? "Minimum 8 character required" : "";
                break;
            case "phoneNumber":
                formErrors.phoneNumber =
                    phoneRegex.test(value) ? "" : "Invalid email phone number";
                break;
            default:
                break;
        }
        setInputValues({ ...inputValues, [name]: value });
    };
    const handleRegister = async () => {
        let { username, email, password, confirmPassword, phoneNumber } = inputValues;
        let dataUser = { username: username, email: email, password: password, confirmPassword: confirmPassword, phoneNumber: phoneNumber }
        if (formValid(inputValues)) {
            setEmpty(false)
            try {
                let list = await handleRegisterApi(dataUser);
                if (list.data && list.data.errCode !== 0) {
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
                if (list.data && list.data.errCode === 0) {
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
                    window.location.href = '/login';
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
        } else {
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
        <div className="background min-vh-100 d-flex flex-row align-items-center">
            <div className='container'>
                <div className='row justify-content-center my-4'>
                    <div className='col-md-10'>
                        <div className="card-group">
                            <div className='card text-white bg-primary py-5'>
                                <div class="card-body text-center">
                                    <div>
                                        <h2>Go back Home</h2>
                                        <p>Let's get started.</p>
                                        <button onClick={event => window.location.href = '/'} class="btn btn-primary mt-3 active" aria-current="page" type="button" tabindex="-1">Back!</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 card">
                                <div className="card-body">
                                    <h1>Register</h1>
                                    <p class="text-muted">Create your account now</p>
                                    <div className="row pt-3">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Username</label>
                                            <input required
                                                placeholder="Username"
                                                type="text"
                                                minLength={3}
                                                className={"form-control " + ((inputValues.formErrors.username.length > 0 && inputValues.username !== '') || (empty === true) ? 'focusError' : '')}
                                                onChange={handleOnChange}
                                                name="username"
                                                value={inputValues.username}
                                            />
                                            {inputValues.formErrors.username.length > 0 && inputValues.username !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.username}</p>
                                                :
                                                ''
                                            }
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" placeholder="Email" required
                                                name="email"
                                                value={inputValues.email}
                                                className={"form-control " + ((inputValues.formErrors.email.length > 0 && inputValues.email !== '') || (empty === true) ? 'focusError' : '')}
                                                onChange={handleOnChange}
                                            />
                                            {inputValues.formErrors.email.length > 0 && inputValues.email !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.email}</p>
                                                :
                                                ''
                                            }
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Password</label>
                                            <input required
                                                placeholder="Password"
                                                type="password"
                                                className={"form-control " + ((inputValues.formErrors.password.length > 0 && inputValues.password !== '') || (empty === true) ? 'focusError' : '')}
                                                name="password"
                                                value={inputValues.password}
                                                minLength={8}
                                                onChange={handleOnChange}
                                            />
                                            {inputValues.formErrors.password.length > 0 && inputValues.password !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.password}</p>
                                                :
                                                ''
                                            }
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Confirm password</label>
                                            <input required
                                                placeholder="Confirm password"
                                                type="password"
                                                className={"form-control " + ((inputValues.formErrors.confirmPassword.length > 0 && inputValues.confirmPassword !== '') || (empty === true) ? 'focusError' : '')}
                                                value={inputValues.confirmPassword}
                                                minLength={8}
                                                name="confirmPassword"
                                                onChange={handleOnChange}
                                            />
                                            {inputValues.formErrors.confirmPassword.length > 0 && inputValues.confirmPassword !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.confirmPassword}</p>
                                                :
                                                ''
                                            }
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Phone number</label>
                                            <input required
                                                placeholder="Phone number"
                                                type="text"
                                                className={"form-control " + ((inputValues.formErrors.phoneNumber.length > 0 && inputValues.phoneNumber !== '') || (empty === true) ? 'focusError' : '')}
                                                onChange={handleOnChange}
                                                name="phoneNumber"
                                                maxLength={11}
                                                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                                                value={inputValues.phoneNumber}
                                            />
                                            {inputValues.formErrors.phoneNumber.length > 0 && inputValues.phoneNumber !== '' ?
                                                <p className="text-danger my-1"><i class="fa-solid fa-circle-exclamation"></i> {inputValues.formErrors.phoneNumber}</p>
                                                :
                                                ''
                                            }
                                        </div>
                                        <ToastContainer />
                                        <div className="my-2">
                                            <button type="submit" className="py-2 btn col-12" style={{ backgroundColor: "#e74c3c", color: "#ffffff" }}
                                                onClick={() => handleRegister()}
                                            >Register</button>
                                        </div>
                                        <div className="text-center pt-4" >
                                            <p style={{ color: "rgba(44,56,74,.681)!important" }}>
                                                Do you have an account ?
                                                <span className="login-button-hover text-decoration-underline" onClick={event => window.location.href = '/login'}>
                                                    Login
                                                </span>
                                            </p>
                                            {/* <p>
                                            By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy. You may receive SMS notifications from us and can opt out at any time.
                                            </p> */}
                                        </div>

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
export default Register;