import findAll from '../Table/DATA';
import { useContext, useEffect, useState } from 'react';
import './ProblemList.css';
import Button from '@material-ui/core/Button';
import { Link, useNavigate } from "react-router-dom";
import ProblemCard from '../ProblemCard/ProblemCard';
import { AppContext } from '../../App';
import { fetchUsers } from '../Utils/ReviewerList';
import CircularProgress from '@mui/material/CircularProgress'

export default function ProblemList() {
  const [data, setData] = useState([]);
  const [orginalData, setOriginalData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [isSortByDateClicked, setIsSortByDateClicked] = useState(false);
  const {isAllow, isUserLoggedIn} = useContext(AppContext);
  const [canSeeReviewer,setCanSeeReviewer] = useState(false);
  const [isAcceptedClicked, setIsAcceptedClicked] = useState(false);
  const [isPendingClicked, setIsPendingClicked] = useState(false);
  const [isRejectedClicked, setIsRejectedClicked] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  // console.log("is: ",isAllow);
  useEffect(() => {
    const fetchData = async () => {
      const result = await findAll();
      setData(result);
      setOriginalData(result);
    };
    fetchData();
  }, []);
  const fetchUserData = async () => {
    try {
      const setters = await fetchUsers();
      const currentUser = setters.find((user) => user.Email === localStorage.getItem('userEmail'));
      if (currentUser) {
        // console.log("current: ",currentUser);
        if(currentUser.Position == 'Final Year'){
          setCanSeeReviewer(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    fetchUserData();
    setLoading(false);
  },[])

  const showFilteredProblems = () => {
    const filteredProblems = orginalData.filter((problem) => {
      return (
        (isAcceptedClicked && problem.status === 'Accepted') ||
        (isPendingClicked && problem.status === 'Pending') ||
        (isRejectedClicked && problem.status === 'Rejected')
      );
    });
    setData(filteredProblems);
  };

  useEffect(() => {
    // console.log('in useEffect:');
    if (!firstTime) {
      showFilteredProblems();
    } else {
      setFirstTime(false);
    }
  }, [isAcceptedClicked, isPendingClicked, isRejectedClicked]);

  const navigate = useNavigate();
  if(Loading){
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2%', height: '100vh' }}>
    <CircularProgress color="inherit" />
  </div>
  }
  if(!isAllow){
    return <h3 style={{ textAlign: 'center' }}>Ask admin for access</h3>
  }
  if(!isUserLoggedIn){
    return <h3 style={{textAlign: 'center'}}>Please <Link to='/login'>Login</Link> to access!</h3>
  }
  const sortByDate = () => {
    const sortedArrAsc = [...data].sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('/'));
      const dateB = new Date(b.date.split('/').reverse().join('/'));
      return dateB - dateA;
    });
    
    const sortedArrDesc = [...data].sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('/'));
      const dateB = new Date(b.date.split('/').reverse().join('/'));
      return dateA - dateB;
    });

    if(!isSortByDateClicked){
      setData(sortedArrAsc);
      setIsSortByDateClicked(true);
    }
    else{
      setIsSortByDateClicked(false);
      setData(sortedArrDesc);
    }
  }

    
  return (
    <>
      <div className='problem-list'>
        
        <h2>Problem List</h2>
        <Button
          variant="contained"
          color="primary"
          style={{ backgroundColor: '#136f63', color: 'white', margin: '10px', marginBottom: '20px' }}
          onClick={() => navigate("/add")}
        >
          + Add
        </Button>

        <div className='Filters'>
          <div className="threeFilters">
        {
          isAcceptedClicked? (
            <Button onClick={()=>setIsAcceptedClicked(false)} style={{backgroundColor: '#CBFFA9', fontSize: '13px'}}>Accepted</Button>
            ): 
            (<Button onClick={()=>setIsAcceptedClicked(true)} >Accepted</Button>)
          }
        {
          isPendingClicked? (
            <Button onClick={()=>setIsPendingClicked(false)} style={{backgroundColor: '#F3AA60', fontSize: '13px'}}>Pending</Button>
            ): 
            (<Button onClick={()=>setIsPendingClicked(true)}>Pending</Button>)
          }
        {
          isRejectedClicked? (
            <Button onClick={()=>setIsRejectedClicked(false)} style={{backgroundColor: '#F15A59', fontSize: '13px'}}>Rejected</Button>
            ): 
            (<Button onClick={()=>setIsRejectedClicked(true)}>Rejected</Button>)
          }
        </div>
        {
          isSortByDateClicked? (
            <Button onClick={sortByDate} style={{backgroundColor: 'rgba(225, 225, 225, 0.909)'}}>Newest First</Button>
          ): 
          (<Button onClick={sortByDate}>Newest First</Button>)
        }
          </div>
      </div>
      {data.length > 0 &&
        data.map((problem) =>
          <ProblemCard
            problemName={problem.problemName}
            problemSetter={problem.problemSetter}
            testers={problem.Reviewer}
            difficulty={problem.difficulty}
            date={problem.date}
            problemId={problem.problemId}
            status = {problem.status}
            key = {problem.problemId}
            canSeeReviewer = {canSeeReviewer}
          />
        )}
    </>
  );
}
