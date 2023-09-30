import React, { useEffect, useState, useCallback, useContext } from 'react';
import './AddProblem.css';
import { database } from '../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import fetchReviewers from './ReviewerList';
import {fetchUsers} from '../Utils/ReviewerList';
import {AppContext} from '../../App'; 
import { Link } from 'react-router-dom';

const AddProblem = () => {
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [Reviewer, setReviewer] = useState('');
  const [editorData1, setEditorData1] = useState('');
  const [editorData2, setEditorData2] = useState('');
  const [editorData3, setEditorData3] = useState('');
  const [editorData4, setEditorData4] = useState('');
  const [editorData5, setEditorData5] = useState('');
  const [Reviewers, setReviewers] = useState(['choose-one']);
  const [SettersList, setSettersList] = useState(['hi']);

  let problemId = '';
  const {isAllow, isUserLoggedIn} = useContext(AppContext);
  // const newFunction = useCallback( async () => {
  //     const reviewers = await fetchReviewers();
  //     setReviewers(reviewers);
  // })
  // useEffect(() => {
  //    newFunction();
  // }, []);

  const newFunction2 = useCallback( async () => {
      const setters = await fetchUsers();
      setSettersList(setters);
      setReviewers(setters);
  });

  useEffect(() => {
      newFunction2();
  }, []);

  const getEditorData1 = (value) => {
    setEditorData1(value);
  };
  const getEditorData2 = (value) => {
    setEditorData2(value);
  };
  const getEditorData3 = (value) => {
    setEditorData3(value);
  };
  const getEditorData4 = (value) => {
    setEditorData4(value);
  };
  const getEditorData5 = (value) => {
    setEditorData5(value);
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link', 'image', 'video'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'image',
    'video',
    'list',
    'bullet',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProblemRef = doc(collection(database, 'Problems'));
    problemId = newProblemRef.id;
    const date = new Date(Date.now());
    let curDate = date.getDate()+'/'+ (date.getMonth() + 1) +'/'+date.getFullYear();
    
    let ProblemSetter = '@';
    ProblemSetter = SettersList.filter((user)=>{
      if(user.Email===localStorage.getItem('userEmail')){
        return user.Name;
      }
    });


    let StatusofProblem = 'Pending'
    if(ProblemSetter==='@'){
      console.log('no problem setter found!');
      return;
    }

    if(!Reviewer){
      alert("Please select a Reviewer!");
      return;
    }
    let CommentsArr = [];
    const formData = {
      problemName,
      ProblemSetter,
      editorData4,
      difficulty,
      editorData5,
      editorData1,
      editorData2,
      editorData3,
      Reviewer,
      StatusofProblem,
      problemId,
      curDate,
      CommentsArr
    };
    setDoc(newProblemRef, formData)
      .then(() => alert('Added Successfully!') )
      .catch((err) => console.log(err));
  };

  const handleReviewerChange = (e) => {
    const selectedReviewer = Reviewers.find(user => user.Email === e.target.value);
    if(selectedReviewer==undefined){
      alert("Please select a Reviewer!");
    }
    else setReviewer(selectedReviewer);
  };
  if(!isAllow){
    return <h3 style={{ textAlign: 'center' }}>Ask admin for access</h3>
  }
  if(!isUserLoggedIn){
    return <h3 style={{textAlign: 'center'}}>Please <Link to='/login'>Login</Link> to access!</h3>
  }
  return (
    <div className="add-problem">
      <form onSubmit={handleSubmit}>
        <div className="left-right">
        <div className="left-side">
          <div>
            <label htmlFor="problemName">Problem Name:</label>
            <input
              type="text"
              id="problemName"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="difficulty">Expected Difficulty:</label>
            <input
              type="text"
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            />
          </div>
          <div className='constraints'>
            <label htmlFor="constraints">Constraints:</label>
            <ReactQuill
              value={editorData5}
              onChange={getEditorData5}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>
          <div className='input-format'>
            <label htmlFor="inputFormat">Input Format:</label>
            <ReactQuill
              value={editorData1}
              onChange={getEditorData1}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>
          <div className='output-format'>
            <label htmlFor="outputFormat">Output Format:</label>
            <ReactQuill
              value={editorData2}
              onChange={getEditorData2}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>

        </div>
        <div className="right-side">
          <div className='right-side-desc'>
            <label htmlFor="description">Description:</label>
            <ReactQuill
              value={editorData4}
              onChange={getEditorData4}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>
          <div className='test-cases'>
            <label htmlFor="sampleTestcases">Sample Testcases:</label>
            <ReactQuill
              value={editorData3}
              onChange={getEditorData3}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </div>
          <div>
            <label htmlFor="tester">Assign a Reviewer: &nbsp;</label>
            
            <select
              id="tester"
              value={Reviewer ? Reviewer.Email : ''}
              onChange={(e) => handleReviewerChange(e)}
              required
            >
              {/* <option value="">Select Tester</option>
              <option value="tester1">Tester 1</option>
              <option value="tester2">Tester 2</option>
              <option value="tester3">Tester 3</option>  */}
              <option key='choose-one' value='choose-one'>Choose one</option>
              {Reviewers.map((user) => (
                <>
                  { user.Position === 'Final Year' &&
                    <option key={user.Email} value={user.Email}>
                      {user.Name}
                    </option>
                  }
                </>
                ))}
            </select>

          </div>
          <button type="submit" className='submit-btn'>Submit</button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default AddProblem;
