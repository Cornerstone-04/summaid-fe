import { doc, setDoc } from "@firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export async function createUserIfNotExists(user: User) {
  const ref = doc(db, "users", user.uid);
  await setDoc(
    ref,
    {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
