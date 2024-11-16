// src/services/Firebase/AuthService.js
import {
  initializeAuth,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getReactNativePersistence,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebaseApp from "../../firebaseConfig";

class AuthService {
  constructor() {
    // Initialize Firebase Auth with AsyncStorage for persistence
    this.auth = initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

    // Initialize Firestore database
    this.db = getFirestore(firebaseApp);
  }

  // Login function
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user; // Return user data
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Signup function
  async signup({ fullname, username, email, password }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user data to Firestore
      await setDoc(doc(this.db, "Users", user.uid), {
        fullName: fullname,
        username: username,
        email: email,
        password: password, // Note: Avoid storing plain passwords in production
        createdAt: new Date(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Fetch all usernames and emails from Firestore
  async getUserData() {
    try {
      const usernames = [];
      const emails = [];
      const querySnapshot = await getDocs(collection(this.db, "Users"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usernames.push(data.username);
        emails.push(data.email);
      });
      return { usernames, emails };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new AuthService();
