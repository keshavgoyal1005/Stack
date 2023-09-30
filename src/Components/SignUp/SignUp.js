import React, { useState, useContext } from 'react';
import {  createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, database } from '../../firebaseConfig';
import {addDoc, collection} from 'firebase/firestore';
import './SignUp.css';


function SignUp() {   
  const navigate = useNavigate();
  const initialValues =  {
    userName: '',
    Name: '',
    Position: '',
    Email: '',
    Password: '',
    Allow: false
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const db = collection(database,'Users');

  const createUser = () => {
    console.log("create user");
    createUserWithEmailAndPassword(auth, formValues.Email, formValues.Password)
    .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        addDoc(db,formValues)
        .then((docRef)=>{
            // console.log('Doc added with id: ',docRef);
            navigate("/login");
        })
        .catch((error)=>{
          console.log('Error adding doc', error);
          setFormErrors({Error: {error}}) 
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert('Error. Email Already in-use.')
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmit(true);
    setFormErrors(validate(formValues));
    // console.log("Error: ", formErrors);
    if(Object.keys(formErrors).length === 0) {
        createUser();
    }
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormValues({...formValues, [name] : value});
    setFormErrors(validate(formValues));
    // console.log("Error: ", formErrors);
  }
  
  const validate = (values) => {
    const errors = {};
    // if(!isSubmit) return errors;
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.userName) {
        errors.userName = "Username is required!";
    }
    if(!values.Name){
        errors.Name = "Name is required!"
    }
    if (!values.Email) {
        errors.Email = "Email is required!";
    } else if (!regex.test(values.Email)) {
        errors.Email = "This is not a valid email format!";
    }
    if(!values.Position){
        errors.Position = "Please select the respective position!"
    }
    if (!values.Password) {
        errors.Password = "Password is required";
    } else if (values.Password.length <= 6) {
        errors.Password = "Password must be more than 6 characters";
    } 
    return errors;
  }

  if(localStorage.getItem('userEmail')){
    navigate('/problemlist');
  }
  return (
    <div className='container'>
        <form className='form'>
            <h4 style={{textAlign: 'center', color: 'coral'}}>Sign Up</h4>
            <label>Username: </label>
            <input type='text' name='userName' value={formValues.userName} onChange={handleChange}/>
            {isSubmit &&
              <p style={{color: 'red'}}>{formErrors.userName}</p>
            }
            <label>Full Name: </label>
            <input type='text' name='Name' value={formValues.Name} onChange={handleChange}/>
            {isSubmit && 
              <p style={{color: 'red'}}>{formErrors.Name}</p>
            }
            <label>Position in RECursion: </label>
            <select name='Position' value={formValues.Position} onChange={handleChange} >
            <option value="Junior Coordinator">Junior Coordinator</option>
            <option value="Senior Coordinator">Senior Coordinator</option>
            <option value="Final Year">Final Year</option>
            </select>
            {isSubmit && 
              <p style={{color: 'red'}}>{formErrors.Position}</p>
            }
            <label>Email address: </label>
            <input type='text' name='Email' value={formValues.Email} onChange={handleChange}/>
            {isSubmit &&  
              <p style={{color: 'red'}}>{formErrors.Email}</p>
            }
            <label>Password: </label>
            <input type='password' name='Password' value={formValues.Password} onChange={handleChange}/>
            {isSubmit && 
              <p style={{color: 'red'}}>{formErrors.Password}</p>
            } 
            {isSubmit && 
              <p style={{color: 'red'}}>{formErrors.Error}</p>
            } 
            <button className='submit-btn' onClick={(event) => handleSubmit(event)}>Submit</button>
            <p style={{marginTop: '6px', marginBottom: '0px'}}>Already have an account? <Link to='/login'>Log in</Link></p>
        </form>
    </div>
  )
}

export default SignUp;