import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../firebaseConfig';

let databaseCollection = collection(database, 'Users');

// const fetchReviewers = () => {
//   return new Promise((resolve, reject) => {
//     let reviewers = [];
//     onSnapshot(databaseCollection, (snapshot) => {
//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         const name = data.Name; 
//         reviewers.push(name);
//       });
//       resolve(reviewers);
//     }, reject);
//   });
// };

const fetchUserListWithEmail = () => {
  return new Promise((resolve, reject) => {
    let UsersList = [];
    onSnapshot(databaseCollection, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        UsersList.push({'Name': data.Name, 'Email': data.Email, 'Position': data.Position});
      });
      // console.log("user: ",UsersList);
      resolve(UsersList);
    }, reject);
  });
}

// export default fetchReviewers;
export const fetchUsers =  fetchUserListWithEmail;
