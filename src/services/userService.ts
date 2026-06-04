import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Helper object for UserService
export const UserService = {
  /**
   * Fetches the user progress from Firestore.
   */
  async getUserProgress(uid: string): Promise<any | null> {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user progress:", error);
      throw error;
    }
  },

  /**
   * Creates a new user document in Firestore.
   */
  async createUserDocument(uid: string, newDoc: any): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, newDoc);
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  },

  /**
   * Updates existing user progress and data.
   */
  async updateUserProgress(uid: string, dataToUpdate: any): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, dataToUpdate, { merge: true });
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  }
};
