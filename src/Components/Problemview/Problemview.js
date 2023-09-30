import React, { useEffect, useState, useContext } from 'react';
import './Problemview.css';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import { Button, Icon } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { AppContext } from '../../App';
import { Link } from 'react-router-dom';
import Comment from '../Comments/Comment';

function Problemview() {

  const [problemValues, setProblemValues] = useState('Loading');
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [isCurrentUserReviewer, setIsCurrentUserReviewer] = useState(false);
  const [status, setStatus] = useState('Pending');
  let params = useParams();
  let problemsdb = collection(database, 'Problems');
  const document = doc(problemsdb, params.problemId);
  let navigate = useNavigate();
  const {isAllow, isUserLoggedIn} = useContext(AppContext);
  useEffect(() => {
    let unsubscribe;
    const fetchData = async () => {
        unsubscribe = onSnapshot(document, (docs) => {
          setProblemValues(docs.data());
          if (docs.data()?.ProblemSetter[0].Email === localStorage.getItem('userEmail')) {
            
            // console.log("I am author");
            setIsCurrentUserAuthor(true);
          }
          if (docs.data()?.Reviewer.Email === localStorage.getItem('userEmail')) {
            setIsCurrentUserReviewer(true);
            // console.log('yes, he is reviewer');
          }
          setStatus(docs.data()?.StatusofProblem);
          // console.log('statuus: ', status);
      });
    };

    fetchData();

    return () => {
      unsubscribe()
    }
  }, []);

  const handleDelete = async (event) => {
    event.stopPropagation();
    try {
      await deleteDoc(document);
      console.log('problem deleted');
      navigate('/problemlist');
      setProblemValues('Loading');
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateDoc(document, {
        StatusofProblem: newStatus,
      });
      console.log('Status updated');
    } catch (error) {
      console.log(error);
    }
  };
  if(!isAllow){
    return <h3 style={{ textAlign: 'center' }}>Ask admin for access</h3>
  }
  if (problemValues === 'Loading') {
    return <h2 style={{ textAlign: 'center' }}>Loading...</h2>;
  }
  if(!isUserLoggedIn){
    return <h3 style={{textAlign: 'center'}}>Please <Link to='/login'>Login</Link> to access!</h3>
  }
  return (
    <>
    <div className="container2">
      <div className="problem-name">
        <h2>
          {problemValues?.difficulty}. {problemValues?.problemName}
        </h2>
      </div>
      <div className="details">
        <div className="status">
          <p style={{ fontWeight: '600' }}>Status - {problemValues?.StatusofProblem}</p>
          <p style={{ fontWeight: '600' }}>Setter - {problemValues?.ProblemSetter[0].Name}</p>
        </div>
        <div className="description">
          <p style={{ fontWeight: 'bold', marginBottom: '0.6rem' }}>Description</p>
          <div dangerouslySetInnerHTML={{ __html: problemValues?.editorData4 }}></div>
        </div>
        <div className="constraints">
          <p style={{ fontWeight: 'bold', marginBottom: '0.6rem' }}>Constraints</p>
          <div dangerouslySetInnerHTML={{ __html: problemValues?.editorData5 }}></div>
        </div>
        <div className="input-format">
          <p style={{ fontWeight: 'bold', marginBottom: '0.6rem' }}>Input Format</p>
          <div dangerouslySetInnerHTML={{ __html: problemValues?.editorData1 }}></div>
        </div>
        <div className="output-format">
          <p style={{ fontWeight: 'bold', marginBottom: '0.6rem' }}>Output Format</p>
          <div dangerouslySetInnerHTML={{ __html: problemValues?.editorData2 }}></div>
        </div>
        <div className="test-cases">
          <p style={{ fontWeight: 'bold', marginBottom: '0.6rem' }}>Sample Test Case</p>
          <div dangerouslySetInnerHTML={{ __html: problemValues?.editorData3 }}></div>
        </div>
      </div>
      {isCurrentUserAuthor && (
        <Button variant="outlined" color="error" onClick={handleDelete}>
          <DeleteOutlineIcon /> Delete
        </Button>
      )}
      {isCurrentUserReviewer && status === 'Pending' && (
        <div className="bottom-div">
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleStatusChange('Rejected')}
            style={{ marginRight: '1rem' }}
            >
            <CloseIcon /> Rejected
          </Button>
          <Button variant="outlined" color="success" onClick={() => handleStatusChange('Accepted')}>
            <DoneIcon /> Accepted
          </Button>
        </div>
      )}
    </div>
      <Comment  />
    </>
  );
}

export default Problemview;
