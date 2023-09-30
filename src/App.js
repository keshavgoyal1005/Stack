import AddProblem from './Components/AddProblem/AddProblem';
import Login from './Components/Login/Login';
import NavBar from './Components/NavBar/NavBar';
import ProblemList from './Components/ProblemList/ProblemList';
import Profile from './Components/Profile/Profile';
import Problemview from './Components/Problemview/Problemview';
import SignUp from './Components/SignUp/SignUp';
import './index.css';
import {Routes, Route} from 'react-router-dom';
import { useState, createContext, useEffect} from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from './firebaseConfig';

export const AppContext = createContext(null);
let databaseCollection = collection(database, 'Users');

export default function App() {
  const [loggedInEmail,setloggedInEmail] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isAllow, setIsAllow] = useState(false);

  
  useEffect(()=>{
    if(userEmail){
      console.log("entered: ",userEmail);
      onSnapshot(databaseCollection, (snapshot)=>{
        snapshot.forEach((doc) => {
          const data = doc.data();
          if(data.Email === userEmail){
            setIsAllow(data.Allow);
          }
        });
      })
    }
  },[userEmail])
  return (
    <AppContext.Provider value={{isAllow, setIsAllow, loggedInEmail,setloggedInEmail,isUserLoggedIn, setIsUserLoggedIn,userEmail, setUserEmail}}>

    <div>
      <NavBar/>
        <Routes>
            <Route path='/' element = {<SignUp/>}/>
            <Route path='/login' element = {<Login/>}/>
            <Route path='/problemlist' element={<ProblemList/>}/>
            <Route path='/problemview/:problemId' element={<Problemview/>} />
            {/* <Route path='/profile' element={<Profile/>}/> */}
            <Route path='/add' element={<AddProblem/>}/>
            <Route path='*' element={<h3 style={{textAlign: 'center'}}>Page not found!</h3>}/>
      </Routes>
    </div>

    </AppContext.Provider>
  )
}

// // To-do
// /*
// 2. setters's & testers name from user feature - done 
// 3. formatting text provided in the input fields - done 
// 4. Problem view - done
// 1. Date object in problem card - done
// 5. open the problem - open-btn - done
// 7. Delete the problem by author - done 
// 8. Change the status of the problem by reviewer - done
// 6. Protect routes - done
// */