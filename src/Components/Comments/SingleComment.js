import React from 'react';
import './SingleComment.css';
import DeleteIcon from '@mui/icons-material/Delete';

function SingleComment({ Name, Content, Position, handleDeleteComment, Email }) {

  return (
    <div className='comment-main'>
      {Position === 'Final Year' ? (
        <div className='Circle' style={{ backgroundColor: '#DB5461' }}>
          {Name[0]}
        </div>
      ) : (
        <div className='Circle' style={{ backgroundColor: '#9ED2BE' }}>
          {Name[0]}
        </div>
      )}
      <div className="comment-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5>{Name}</h5>
          { Email === localStorage.getItem('userEmail') && 
            <button className = 'delete-comment-btn' variant= 'outline' onClick={handleDeleteComment}>{<DeleteIcon/>}</button>
          }
          </div>
        <p>{Content}</p>
      </div>
    </div>
  );
}

export default SingleComment;
