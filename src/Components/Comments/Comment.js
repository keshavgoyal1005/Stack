import React, { useEffect, useState, useCallback, useContext } from 'react'
import './Comment.css'
import CommentBox from './CommentBox'
import SingleComment from './SingleComment';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import {fetchUsers} from '../Utils/ReviewerList';
import { AppContext } from '../../App';

const Comment = () => {
  const [CommentsArr, setCommentsArr] = useState([]);
  const[Name, setName] = useState('');
  const[Position, setPosition] = useState('');
  const {userEmail} = useContext(AppContext);
  const[Email,setEmail] = useState(userEmail);
  
  let problemsdb = collection(database, 'Problems');
  const url = window.location.pathname;
  const problemId = url.split('/problemview/')[1];
  const document = doc(problemsdb, problemId);

  useEffect(() => {
    let unsubscribe;
    const fetchData = async () => {
        unsubscribe = onSnapshot(document, (docs) => {
          setCommentsArr(docs.data()?.CommentsArr);
      });
    };

    fetchData();
    return () => {
      unsubscribe()
    }
  }, []);

  const newFunction2 = useCallback( async () => {
    const Users = await fetchUsers();
    const UserFound = Users.filter((User)=> User.Email===Email );
    
    setName(UserFound[0].Name);
    setPosition(UserFound[0].Position);
  });
  useEffect(()=>{
    newFunction2();
  },[])

  const handleDeleteComment = async (index) => {
    try{
      const docSnap = await getDoc(document);
      const currCommentsArray = docSnap.data()?.CommentsArr || [];

      const updatedCommentsArray = currCommentsArray?.filter((comment,curIndex)=>
        curIndex!==index
      )

      await updateDoc(document,{CommentsArr: updatedCommentsArray});
    }
    catch (error){
      console.error('Error deleting comment:', error);
    }
  };

  return(
    <div className="comment-section">
        <h4>Comments {CommentsArr?.length!==0?CommentsArr?.length:''}</h4>
        <div className='Line'></div>
        <CommentBox Name={Name} Email={Email} Position={Position}/>
        { 
          CommentsArr?.map((comment,index)=>
            <SingleComment key={index} Name={comment.Name} Content={comment.Content} Position={comment.Position} Email={comment.Email}
            handleDeleteComment={()=>handleDeleteComment(index)}/>
          )
        }
    </div>
  )
}

export default Comment