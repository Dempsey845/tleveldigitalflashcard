import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function addScoreBySubjects(userId, scoreBySubject) {
  const scoreRef = doc(db, "users", userId, "scores", "latest");
  const snap = await getDoc(scoreRef);

  if (!snap.exists()) {
    await setDoc(scoreRef, scoreBySubject);
  } else {
    const updateData = {};
    for (const [subject, values] of Object.entries(scoreBySubject)) {
      for (const [key, value] of Object.entries(values)) {
        updateData[`${subject}.${key}`] = value;
      }
    }

    await updateDoc(scoreRef, updateData);
  }
}

export async function getScoreBySubjects(userId) {
  const scoreRef = doc(db, "users", userId, "scores", "latest");
  const snap = await getDoc(scoreRef);

  if (snap.exists()) {
    return snap.data();
  } else {
    return null;
  }
}
