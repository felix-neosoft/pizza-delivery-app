import React,{useState, useRef, useEffect} from 'react'
import {Form} from 'react-bootstrap'
import { loginuser } from '../config/NodeServices';

//RegEx for Validation
const RegForEmail = RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$');
const RegForPassword = RegExp('^[a-zA-Z0-9@*!&%$]{8,15}$')

function Login(props) {

    useEffect(()=>{
        if(sessionStorage.getItem('isLogged')==='true'){
            window.location.replace('/dashboard')
        }
        else{
            sessionStorage.setItem('isLogged',false)
        }
    },[])


    //State Variables
    const [values,setValues] = useState({email:'',password:''})
    const [errors,setErrors] = useState({email:'',password:''})

    //useRef Assigning
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    //handler function to perform validation
    const handler = e =>{
        let name = e.target.name
        switch(name){
            case 'email':
                setErrors({...errors,email:RegForEmail.test(emailRef.current.value)?'':'Please Enter Email in correct format'})
                setValues({...values,email:emailRef.current.value})
                break
            case 'password':
                setErrors({...errors,password:RegForPassword.test(passwordRef.current.value)?'':'Please Enter Password in Alphanumeric and Symbols'})
                setValues({...values,password:passwordRef.current.value})
                break 
            default:      
        }
    }

    //formSubmit function to submit values to server
    const formSubmit = () =>{    
        if(values.email!=='' && values.password!==''){
            if(errors.email==='' && errors.password===''){
                loginuser(values).then(res =>{
                    const data = res.data
                    if(data.err===1){
                        alert(data.msg)
                    }
                    else{
                        sessionStorage.setItem('isLogged',true)
                        sessionStorage.setItem('_token',data.token)
                        alert(data.msg)
                        props.history.push('/dashboard')
                        
                    }
                })
            }else { alert("404! Validation Error!")}
        }else { alert("404! Input Fields must not be blank") }
    }


    return (
        <div className="index-container">
            <img alt="img" className="pizza-wall-index" src="images/gui/index_wallpaper.jpg" />
            <img alt="img" className="index-logo" src="images/gui/logo.svg" />
            
            <div className="login-container">
            <Form className="index-form index-login">
                <img alt="img" className="pizza-sharing" src="images/gui/pizza_sharing.svg" />
                <h2>Welcome</h2>
                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" name="email" ref={emailRef} isValid={values.email!==''?true:false} isInvalid={errors.email!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-insert">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" ref={passwordRef} isValid={values.password!==''?true:false} isInvalid={errors.password!==''?true:false} onChange={e => handler(e)}></Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>
                <a className="btn-index-change" href="/register" >Not a User? Sign Up</a>  
                <button className="btn-index-submit btn-login" onClick={formSubmit} >Login</button>
                
            </Form>
            </div>
        </div>
    )
}

export default Login
