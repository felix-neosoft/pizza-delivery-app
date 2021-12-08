import React,{useState, useRef} from 'react'
import {Form} from 'react-bootstrap'
import { addUser } from '../config/NodeServices';

//RegEx for Validation
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$');
const RegForName = RegExp('^[a-zA-Z]+\\s[a-zA-Z]+$')
const RegForPassword = RegExp('^[a-zA-Z0-9@*!&%$]{8,15}$')
const RegForMobile=RegExp('^((\\+91-?)|0)?[0-9]{10}$')
const RegForAddress=RegExp("^[a-zA-Z0-9\\s,.'-]{7,}$")

function Register() {
    //State Variables
    const [values,setValues] = useState({name:'',email:'',mobile:'',password:'',address:'',cpassword:''})
    const [errors,setErrors] = useState({name:'',email:'',mobile:'',password:'',address:'',cpassword:''})

    //useRef Assigning
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const mobileRef = useRef(null)
    const passwordRef = useRef(null)
    const cpasswordRef = useRef(null)
    const addressRef = useRef(null)

    //handler function to perform validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'name':
                setErrors({...errors,name:RegForName.test(nameRef.current.value)?'':'Please Enter Full Name'})
                setValues({...values,name:nameRef.current.value})
                break
            case 'email':
                setErrors({...errors,email:RegForEmail.test(emailRef.current.value)?'':'Please Enter Email in correct format'})
                setValues({...values,email:emailRef.current.value})
                break
            case 'mobile':
                setErrors({...errors,mobile:RegForMobile.test(mobileRef.current.value)?'':'Please Enter 10 Digit Mobile Number'})
                setValues({...values,mobile:mobileRef.current.value})
                break
            case 'address':
                setErrors({...errors,address:RegForAddress.test(addressRef.current.value)?'':'Please Enter Address'})
                setValues({...values,address:addressRef.current.value})
                break
            case 'password':
                setErrors({...errors,password:RegForPassword.test(passwordRef.current.value)?'':'Please Enter Password in Alphanumeric and Symbols'})
                setValues({...values,password:passwordRef.current.value})
                break 
            case 'cpassword':
                setErrors({...errors,cpassword:values.password===cpasswordRef.current.value?'':'Password and Confirm Password must be match'})
                setValues({...values,cpassword:cpasswordRef.current.value})
                break
            default:           
        }
    }

    //formSubmit function to submit values to server
    const formSubmit = () =>{    
        if(values.name!=='' && values.email!=='' && values.mobile!=='' && values.address!=='' && values.password!=='' && values.cpassword!==''){
            if(errors.name==='' && errors.email==='' && errors.mobile==='' && errors.address==='' && errors.password==='' && errors.cpassword===''){
                addUser(values).then(res =>{
                     alert(res.data)
                     window.location.replace('/')
                })
            }else { alert("404! Validation Error!")}
        }else { alert("404! Input Fields must not be blank") }
    }


    return (
        <div className="index-container">
            <img alt="img" class="pizza-wall-index" src="images/gui/index_wallpaper.jpg" />
            <img alt="img" className="index-logo" src="images/gui/logo.svg" />
            <div className="login-container">
            <Form className="index-form index-register">
                <img alt="img" width="100" src="images/gui/user.svg" />
                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" name="name" ref={nameRef} isValid={values.name!==''?true:false} isInvalid={errors.name!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="email" ref={emailRef} isValid={values.email!==''?true:false} isInvalid={errors.email!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control type="text" name="mobile" ref={mobileRef} isValid={values.mobile!==''?true:false} isInvalid={errors.mobile!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" ref={addressRef} isValid={values.address!==''?true:false} isInvalid={errors.address!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" ref={passwordRef} isValid={values.password!==''?true:false} isInvalid={errors.password!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" name="cpassword" ref={cpasswordRef} isValid={values.cpassword!==''?true:false} isInvalid={errors.cpassword!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.cpassword}</Form.Control.Feedback>
                </Form.Group>
                <a className="btn-index-change" href="/" >Already a user? Sign In</a>  
                <button className="btn-index-submit btn-register" onClick={formSubmit} >Register</button>
                
            </Form>
            </div>
    </div>
    )
}

export default Register
