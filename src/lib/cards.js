import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export async function markCardIncorrect(userId, cardId) {
  const cardRef = doc(db, "users", userId, "incorrectCards", cardId);
  const snap = await getDoc(cardRef);

  if (!snap.exists()) {
    await setDoc(cardRef, {
      lastSeen: serverTimestamp(),
      attempts: 1,
    });
  } else {
    await updateDoc(cardRef, {
      lastSeen: serverTimestamp(),
      attempts: increment(1),
    });
  }
}

export async function fetchIncorrectCards(userId) {
  const colRef = collection(db, "users", userId, "incorrectCards");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchAllCards() {
  const colRef = collection(db, "cards");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
