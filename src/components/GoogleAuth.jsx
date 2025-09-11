import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

export default function GoogleAuth({ useRedirect = false }) {
  const doSignIn = async () => {
    try {
      const result = useRedirect
        ? await signInWithRedirect(auth, googleProvider)
        : await signInWithPopup(auth, googleProvider);

      if (!result) return;

      const user = result.user;
      const providerData = user.providerData.find(
        (p) => p.providerId === "google.com"
      );
      const googleUID = providerData?.uid || null;

      const userId = user.uid;
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          googleUID,
          displayName: user.displayName || "",
          email: user.email || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } else {
        await updateDoc(userRef, { lastLogin: serverTimestamp() });
      }

      console.log("Signed in:", user.displayName);
    } catch (err) {
      console.error("Sign in error", err);
    }
  };

  const doSignOut = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <div className="flex gap-2">
      <button onClick={doSignIn} className="btn btn-google">
        Sign in with Google
      </button>
      <button onClick={doSignOut} className="btn btn-google-outlined">
        Sign out
      </button>
    </div>
  );
}
