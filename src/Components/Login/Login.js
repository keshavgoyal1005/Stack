import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import {AppContext} from '../../App'; 

function Login() {
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setIsUserLoggedIn,setloggedInEmail, setUserEmail} = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setloggedInEmail(user.email);
      setIsUserLoggedIn(true);
      setUserEmail(user.email);
      localStorage.setItem('userEmail', user.email);
      // console.log("user: ",user.email);
      navigate('/problemlist');
    })
    .catch((err) => {
      alert("Incorrect Password/Email.");
      console.log(err.code);
      console.log(err.message);
    });
  }
  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  return (
    <div className='container-3'>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <h4 style={{textAlign: 'center', color: 'coral'}}>Log In</h4>
        <label>Email Address: </label>
        <input type='text' value={email} onChange={(e) => handleChange(e)}/>
        <label>Password: </label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button className='submit-btn'type='submit'>Submit</button>
        <p style={{marginTop: '6px', marginBottom: '0px'}}>Don't have an account? <Link to='/'>Sign Up</Link></p>
      </form>
    </div>
  )
}

export default Login;
