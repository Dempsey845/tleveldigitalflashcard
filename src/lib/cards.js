import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function markCardIncorrect(userId, cardId) {
  const cardRef = doc(db, "users", userId, "incorrectCards", cardId);
  const snap = await getDoc(cardRef);

  if (!snap.exists()) {
    await setDoc(cardRef, {
      lastSeen: serverTimestamp(),
      attempts: 1,
      cardId: cardId,
    });
  } else {
    await updateDoc(cardRef, {
      lastSeen: serverTimestamp(),
      attempts: increment(1),
      cardId: cardId,
    });
  }
}

export async function markCardCorrect(userId, cardId) {
  if (!userId || !cardId) return;

  const cardRef = doc(db, "users", userId, "incorrectCards", cardId);

  try {
    await deleteDoc(cardRef);
  } catch (error) {
    console.error("Error removing card from incorrect:", error);
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

  const cards = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}
