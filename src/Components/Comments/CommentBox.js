import React, { useState } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import './CommentBox.css';

function CommentBox({ Name, Email, Position }) {
  const [Content, setContent] = useState('');

  const AddCommentClick = async () => {
    if (Content?.length === 0 || Content.trimStart().length === 0){
      setContent('');
      return;
    }

    const problemsdb = collection(database, 'Problems');
    const url = window.location.pathname;
    const problemId = url.split('/problemview/')[1];
    const documentRef = doc(problemsdb, problemId);

    try {
     
      const docSnapshot = await getDoc(documentRef);
      const currentCommentsArr = docSnapshot.data()?.CommentsArr || [];
      const updatedCommentsArr = [...currentCommentsArr, {Name, Email, Content, Position}];
     
      await updateDoc(documentRef, { CommentsArr: updatedCommentsArr });

      setContent('');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <div className='comment-Box'>
      { Position === 'Final Year' ? <div className='Circle' style={{backgroundColor: '#DB5461'}}>{Name[0]}</div>
      : <div className='Circle' style={{backgroundColor: '#9ED2BE'}}>{Name[0]}</div>
      }
      <input
        type='text'
        style={{ marginLeft: '10px', marginRight: '10px', fontSize: '16px', translate: '0px 3px' }}
        onChange={(e) => setContent(e.target.value)}
        value={Content}
        placeholder='type your comment...'
      />
      <button className='post-btn' onClick={AddCommentClick}>
        Post
      </button>
    </div>
  );
}

export default CommentBox;
