// Import Firestore services
import { doc, getDoc } from "firebase/firestore";
import { firebaseFirestore } from "./constants";

// Function to fetch question data from Firestore
export async function fetchQuestionFromFirebase(questionId: number) {
  const docRef = doc(firebaseFirestore, "quiz/question", questionId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}
