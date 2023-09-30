import {database} from '../../firebaseConfig';
import { getDocs, collection } from "firebase/firestore"; 

// let DATA = [
//     {"id": 1, "Problem_Name": "Light and 1", "setter": "Varan"},
//     {"id": 2, "Problem_Name": "Light and 2", "setter": "Varan"},
//     {"id": 3, "Problem_Name": "Light and 3", "setter": "Varan"},
//     {"id": 4, "Problem_Name": "Light and 4", "setter": "Varan"},
//     {"id": 5, "Problem_Name": "Light and 5", "setter": "Varan"}
// ];
const findAll = async () => {
    
    const doc_refs = await getDocs(collection(database, 'Problems'));
    let DATA = []

    doc_refs.forEach(problem => {
        DATA.push({
            "problemName": problem.data().problemName,
            "problemSetter": problem.data().ProblemSetter[0].Name, // To-do : - find the setters name using firebase auth
            "Reviewer": problem.data().Reviewer.Name,
            "difficulty": problem.data().difficulty,
            "date": problem.data().curDate,
            "status": problem.data().StatusofProblem,
            "problemId": problem.data().problemId
        })
    });
    console.log("Dd: ",DATA);
    return DATA;
}

export default findAll;