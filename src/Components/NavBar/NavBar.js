import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUsers } from '../Utils/ReviewerList';
import Button from '@mui/material/Button';
import './NavBar.css';
import { AppContext } from '../../App';

export default function NavBar() {
  const [userName, setUserName] = useState('');
  const {isUserLoggedIn, setIsUserLoggedIn, userEmail, setUserEmail} = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    setIsUserLoggedIn(!!email); 
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const fetchUserData = async () => {
    try {
      const setters = await fetchUsers();
      const currentUser = setters.find((user) => user.Email === userEmail);
      if (currentUser) {
        setUserName(currentUser.Name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
    setIsUserLoggedIn(false);
    navigate('/');
  };

  return (
    <div>
      <div className="navbar">
        <Link
          to={userEmail!==""?"/problemlist":"/login"}
          style={{
            color: '#2B2A4C',
            fontSize: '20px',
            fontWeight: '600',
            fontFamily: 'Poppins',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
        >
          Stack
        </Link>
        {isUserLoggedIn && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Poppins', fontWeight: '600' }}>Hi, {userName} &nbsp; </span>
            <Button variant="contained" onClick={handleClick}>
              Log Out
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}
